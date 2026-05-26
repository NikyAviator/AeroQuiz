# Dockerfile for production quiz-service
# Build stage
FROM golang:1.25 AS builder

WORKDIR /build

# Copy backend files (when building from project root)
COPY go.mod go.sum ./
RUN go mod download

COPY services/quiz-service ./services/quiz-service
COPY shared ./shared

RUN CGO_ENABLED=0 GOOS=linux go build -o ./services/quiz-service/bin/quiz-service ./services/quiz-service/cmd/main.go

# Runtime stage
FROM gcr.io/distroless/static:nonroot

COPY --from=builder /build/services/quiz-service/bin/quiz-service /quiz-service
EXPOSE 5000
USER nonroot:nonroot
ENTRYPOINT ["/quiz-service"]
