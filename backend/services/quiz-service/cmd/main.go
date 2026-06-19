// main.go — entry point for the quiz-service.
// Responsibilities: load config, connect MongoDB, wire dependencies, start server.
// Runs the HTTP server in a goroutine so the main goroutine can listen for OS
// signals and perform a graceful shutdown — this is what makes the server concurrent.
package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/middleware"
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/repository"
	v1 "github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/routes/v1"
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/service"
	"github.com/NikyAviator/AeroQuiz/backend/shared/env"
	sharedmongo "github.com/NikyAviator/AeroQuiz/backend/shared/mongo"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Load config from environment
	mongoURI := env.GetString("MONGODB_URI", "mongodb://localhost:27017")
	dbName := env.GetString("MONGODB_DBNAME", "aeroquiz")
	port := env.GetString("PORT", "5000")
	adminEmail := env.GetString("ADMIN_EMAIL", "")
	apiSharedSecret := env.GetString("API_SHARED_SECRET", "")
	// COOKIE_SECURE: false in dev (HTTP), true in production (HTTPS).
	// Set to true in your production env file / K8s secret.
	cookieSecure := env.GetBool("COOKIE_SECURE", false)

	// 2. Connect to MongoDB
	_, db, closeMongo, err := sharedmongo.ConnectMongoDB(context.Background(), sharedmongo.MongoConfig{
		URI:         mongoURI,
		DBName:      dbName,
		ConnTimeout: 30 * time.Second,
	})
	if err != nil {
		log.Fatalf("mongo connect: %v", err)
	}
	defer func() {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := closeMongo(ctx); err != nil {
			log.Printf("mongo disconnect error: %v", err)
		}
	}()

	// 3. DI repo layer & Ensure indexes — safe to call on every startup
	userRepo := repository.NewMongoUserRepository(db)
	if err := userRepo.EnsureIndexes(context.Background()); err != nil {
		log.Fatalf("ensure user indexes: %v", err)
	}
	userResultRepo := repository.NewMongoUserResultRepository(db)
	if err := userResultRepo.EnsureIndexes(context.Background()); err != nil {
		log.Fatalf("ensure user result indexes: %v", err)
	}
	questionRepo := repository.NewMongoQuestionRepository(db)
	if err := questionRepo.EnsureIndexes(context.Background()); err != nil {
		log.Fatalf("ensure question indexes: %v", err)
	}

	// 4. Wire dependencies: repo → service → middleware → routes
	userSvc := service.NewUserService(userRepo, adminEmail)
	mws := middleware.NewAuth(userSvc, adminEmail, apiSharedSecret)

	// 5. Set up Gin router
	router := gin.Default()
	v1.Register(router, userSvc, v1.Options{
		MW:              mws,
		AdminEmail:      adminEmail,
		ApiSharedSecret: apiSharedSecret, // This is to make sure the request is coming from the frontend.
		CookieSecure:    cookieSecure,
	})

	// 6. Start HTTP server in its own goroutine.
	// Gin handles each incoming request in a separate goroutine automatically —
	// this is what gives us concurrency per user request.
	// The server goroutine runs independently while main blocks on the signal channel below.
	srv := &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	go func() {
		log.Printf("quiz-service listening on :%s", port)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("server error: %v", err)
		}
	}()

	// 7. Block until SIGINT (Ctrl+C) or SIGTERM (K8s pod shutdown) arrives
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	// 8. Graceful shutdown — drain in-flight requests before closing
	log.Println("shutting down server…")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("forced shutdown: %v", err)
	}
	log.Println("server stopped cleanly")
}
