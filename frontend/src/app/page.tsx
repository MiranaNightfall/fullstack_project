"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegisterClick = () => {
    router.push('/register');
  };

  const handleLoginClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else if (data.token) {
        localStorage.setItem("token", data.token);
        router.push('/dashboard');
      } else {
        setError("Unexpected response from server");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-300 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden login-box">
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-violet-900">Welcome to ArtSelling!</h1>
          <p className="mb-4 text-violet-800">Do you want to sell your amazing work? ArtSelling is the perfect place for you!</p>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form className="space-y-4" onSubmit={handleLoginClick}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username or Email</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your username or email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log in
            </button>

            <p className="text-sm text-gray-600 flex items-center">
              Don't have an account?
              <span 
                onClick={handleRegisterClick} 
                className="ml-2 text-violet-800 cursor-pointer hover:text-violet-600"
              >
                Register Here
              </span>
            </p>
          </form>
        </div>
        <div className="w-full md:w-1/2 relative h-64 md:h-auto">
          <Image
            src="/image.png"
            alt="Background"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    </main>
  );
}
