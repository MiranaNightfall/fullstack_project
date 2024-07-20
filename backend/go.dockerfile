FROM golang:1.22.5-alpine

WORKDIR /app

COPY . .

# Download and install the dependencies:
RUN go get -d -v ./...

# build the go app
RUN go build -o api .

EXPOSE 8000

CMD ["./api"]