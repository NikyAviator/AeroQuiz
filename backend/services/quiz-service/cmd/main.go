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

	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/controllers"
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/repository"
	v1 "github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/routes/v1"
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/service"
	"github.com/NikyAviator/AeroQuiz/backend/shared/env"
	sharedmongo "github.com/NikyAviator/AeroQuiz/backend/shared/mongo"
	"github.com/gin-gonic/gin"
)

func main() {
	// ── 1. Load config from environment ──────────────────────────────────────
	mongoURI := env.GetString("MONGODB_URI", "mongodb://localhost:27017")
	dbName := env.GetString("MONGODB_DBNAME", "aeroquiz")
	port := env.GetString("PORT", "5000")
	adminEmail := env.GetString("ADMIN_EMAIL", "")
	apiSharedSecret := env.GetString("API_SHARED_SECRET", "") // reserved for service-to-service auth
	_ = apiSharedSecret

	// ── 2. Connect to MongoDB ─────────────────────────────────────────────────
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

	// ── 3. Ensure indexes (runs quickly; safe to call on every startup) ───────
	userRepo := repository.NewMongoUserRepository(db)
	if err := userRepo.EnsureIndexes(context.Background()); err != nil {
		log.Fatalf("ensure user indexes: %v", err)
	}

	// ── 4. Wire up the dependency graph ──────────────────────────────────────
	//   repo → service → controller → routes
	userSvc := service.NewUserService(userRepo, adminEmail)
	userCtrl := controllers.NewUserController(userSvc)

	// ── 5. Set up Gin router ──────────────────────────────────────────────────
	router := gin.Default()

	// Global middleware can go here, e.g. CORS, request-id, rate-limiting
	// router.Use(cors.Default())

	api := router.Group("/api/v1")
	v1.RegisterRoutes(api, userCtrl)

	// ── 6. Start the HTTP server concurrently ─────────────────────────────────
	// The server runs in its own goroutine so the main goroutine can listen
	// for OS signals and perform a graceful shutdown.
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

	// ── 7. Graceful shutdown on SIGINT / SIGTERM ──────────────────────────────
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit // block here until a signal arrives

	log.Println("shutting down server…")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("forced shutdown: %v", err)
	}
	log.Println("server stopped cleanly")
}
