package main

import (
    "database/sql"
    "encoding/json"
    "log"
    "net/http"
    "os"
    "time"
    "golang.org/x/crypto/bcrypt"
    "github.com/dgrijalva/jwt-go"
    "github.com/gorilla/mux"
    _ "github.com/lib/pq"
)

type User struct {
    Id       int    `json:"id"`
    Username string `json:"username"`
    Email    string `json:"email"`
    Password string `json:"password,omitempty"`
}

type Credentials struct {
    Username string `json:"username"`
    Password string `json:"password"`
}

type Claims struct {
    Username string `json:"username"`
    jwt.StandardClaims
}

var jwtKey = []byte(os.Getenv("JWT_SECRET"))

func main() {
    db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    if err := db.Ping(); err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    _, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE,
            password TEXT NOT NULL
        )
    `)
    if err != nil {
        log.Fatal(err)
    }

    router := mux.NewRouter()
    router.HandleFunc("/api/register", registerHandler(db)).Methods("POST")
    router.HandleFunc("/api/login", loginHandler(db)).Methods("POST")
    router.HandleFunc("/api/users", authMiddleware(getUsers(db))).Methods("GET")
    router.HandleFunc("/api/users", authMiddleware(createUser(db))).Methods("POST")
    router.HandleFunc("/api/users/{id}", authMiddleware(getUser(db))).Methods("GET")
    router.HandleFunc("/api/users/{id}", authMiddleware(updateUser(db))).Methods("PUT")
    router.HandleFunc("/api/users/{id}", authMiddleware(deleteUser(db))).Methods("DELETE")
    router.HandleFunc("/api/users/me", authMiddleware(getCurrentUser(db))).Methods("GET")

    enhancedRouter := enableCORS(jsonContentTypeMiddleware(router))
    log.Println("Server starting on :8000")
    log.Fatal(http.ListenAndServe(":8000", enhancedRouter))
}

func enableCORS(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r)
    })
}

func jsonContentTypeMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        next.ServeHTTP(w, r)
    })
}

func registerHandler(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        log.Println("Received request for /api/register")

        var user User
        if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }

        // Check if username or email already exists
        var existingUser User
        err := db.QueryRow("SELECT id FROM users WHERE username = $1 OR email = $2", user.Username, user.Email).Scan(&existingUser.Id)
        if err == nil {
            http.Error(w, "Username or email already exists", http.StatusConflict)
            return
        } else if err != sql.ErrNoRows {
            log.Printf("Error checking existing user: %v", err)
            http.Error(w, "Error checking existing user", http.StatusInternalServerError)
            return
        }

        hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
        if err != nil {
            log.Printf("Error hashing password: %v", err)
            http.Error(w, "Error hashing password", http.StatusInternalServerError)
            return
        }

        _, err = db.Exec("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
            user.Username, user.Email, string(hashedPassword))
        if err != nil {
            log.Printf("Error creating user: %v", err)
            http.Error(w, "Error creating user", http.StatusInternalServerError)
            return
        }

        w.WriteHeader(http.StatusCreated)
        json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully"})
    }
}

func createToken(username string) (string, error) {
    expirationTime := time.Now().Add(24 * time.Hour)
    claims := &Claims{
        Username: username,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtKey)
}

func loginHandler(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var creds Credentials
        if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }

        var user User
        err := db.QueryRow("SELECT id, username, password FROM users WHERE username = $1",
            creds.Username).Scan(&user.Id, &user.Username, &user.Password)
        if err != nil {
            if err == sql.ErrNoRows {
                json.NewEncoder(w).Encode(map[string]string{"error": "Invalid credentials"})
            } else {
                log.Printf("Database error: %v", err)
                json.NewEncoder(w).Encode(map[string]string{"error": "Database error"})
            }
            return
        }

        err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(creds.Password))
        if err != nil {
            json.NewEncoder(w).Encode(map[string]string{"error": "Invalid credentials"})
            return
        }

        token, err := createToken(user.Username)
        if err != nil {
            log.Printf("Error creating token: %v", err)
            json.NewEncoder(w).Encode(map[string]string{"error": "Error creating token"})
            return
        }

        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(map[string]string{"message": "Login successful", "token": token})
    }
}

func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        tokenString := r.Header.Get("Authorization")
        if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
            tokenString = tokenString[7:]
        }

        if tokenString == "" {
            if cookie, err := r.Cookie("token"); err == nil {
                tokenString = cookie.Value
            }
        }

        if tokenString == "" {
            http.Error(w, "Missing authorization token", http.StatusUnauthorized)
            return
        }

        claims := &Claims{}
        token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
            return jwtKey, nil
        })

        if err != nil || !token.Valid {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }

        next.ServeHTTP(w, r)
    }
}

func getUsers(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        rows, err := db.Query("SELECT id, username, email FROM users")
        if err != nil {
            log.Printf("Error fetching users: %v", err)
            http.Error(w, "Error fetching users", http.StatusInternalServerError)
            return
        }
        defer rows.Close()

        users := []User{}
        for rows.Next() {
            var u User
            if err := rows.Scan(&u.Id, &u.Username, &u.Email); err != nil {
                log.Printf("Error scanning users: %v", err)
                http.Error(w, "Error scanning users", http.StatusInternalServerError)
                return
            }
            users = append(users, u)
        }

        json.NewEncoder(w).Encode(users)
    }
}

func createUser(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var u User
        if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }

        hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
        if err != nil {
            log.Printf("Error hashing password: %v", err)
            http.Error(w, "Error hashing password", http.StatusInternalServerError)
            return
        }

        err = db.QueryRow("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
            u.Username, u.Email, string(hashedPassword)).Scan(&u.Id)
        if err != nil {
            log.Printf("Error creating user: %v", err)
            http.Error(w, "Error creating user", http.StatusInternalServerError)
            return
        }

        u.Password = ""
        json.NewEncoder(w).Encode(u)
    }
}

func getUser(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        vars := mux.Vars(r)
        id := vars["id"]

        var u User
        err := db.QueryRow("SELECT id, username, email FROM users WHERE id = $1", id).Scan(&u.Id, &u.Username, &u.Email)
        if err != nil {
            if err == sql.ErrNoRows {
                http.Error(w, "User not found", http.StatusNotFound)
            } else {
                log.Printf("Error fetching user: %v", err)
                http.Error(w, "Error fetching user", http.StatusInternalServerError)
            }
            return
        }

        json.NewEncoder(w).Encode(u)
    }
}

func updateUser(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        vars := mux.Vars(r)
        id := vars["id"]

        var u User
        if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }

        _, err := db.Exec("UPDATE users SET username = $1, email = $2 WHERE id = $3",
            u.Username, u.Email, id)
        if err != nil {
            log.Printf("Error updating user: %v", err)
            http.Error(w, "Error updating user", http.StatusInternalServerError)
            return
        }

        u.Id = 0
        json.NewEncoder(w).Encode(u)
    }
}

func deleteUser(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        vars := mux.Vars(r)
        id := vars["id"]

        result, err := db.Exec("DELETE FROM users WHERE id = $1", id)
        if err != nil {
            log.Printf("Error deleting user: %v", err)
            http.Error(w, "Error deleting user", http.StatusInternalServerError)
            return
        }

        rowsAffected, err := result.RowsAffected()
        if err != nil {
            log.Printf("Error getting rows affected: %v", err)
            http.Error(w, "Error getting rows affected", http.StatusInternalServerError)
            return
        }

        if rowsAffected == 0 {
            http.Error(w, "User not found", http.StatusNotFound)
            return
        }

        w.WriteHeader(http.StatusNoContent)
    }
}

func getCurrentUser(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        tokenString := r.Header.Get("Authorization")
        if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
            tokenString = tokenString[7:]
        }
        if tokenString == "" {
            if cookie, err := r.Cookie("token"); err == nil {
                tokenString = cookie.Value
            }
        }

        if tokenString == "" {
            http.Error(w, "Missing authorization token", http.StatusUnauthorized)
            return
        }

        claims := &Claims{}
        token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
            return jwtKey, nil
        })

        if err != nil || !token.Valid {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }

        var user User
        err = db.QueryRow("SELECT id, username, email FROM users WHERE username = $1", claims.Username).Scan(&user.Id, &user.Username, &user.Email)
        if err != nil {
            if err == sql.ErrNoRows {
                http.Error(w, "User not found", http.StatusNotFound)
            } else {
                log.Printf("Error fetching current user: %v", err)
                http.Error(w, "Error fetching current user", http.StatusInternalServerError)
            }
            return
        }

        json.NewEncoder(w).Encode(user)
    }
}