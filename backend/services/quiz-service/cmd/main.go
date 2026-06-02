// This is the main entry point for the quiz-service. It sets up the HTTP server, connects to MongoDB, and wires up the routes and controllers.
package main

import (
	"context"
	"log"
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
	apiSharedSecret := env.GetString("API_SHARED_SECRET", "") // reserved for service-to-service auth
	_ = apiSharedSecret

	// 2. Connect to MongoDB
	_, db, closeMongo, err := sharedmongo.ConnectMongoDB(context.Background(), sharedmongo.MongoConfig{
		URI:         mongoURI,
		DBName:      dbName,
		ConnTimeout: 30 * time.Second,
	})
	if err != nil {
		log.Fatalf("mongo connect: %v", err)
	}
	defer func() { _ = closeMongo(context.Background()) }()

	// DI: repo layers
	userRepo := repository.NewMongoUserRepository(db)

	// Ensure indexes
	if err := userRepo.EnsureIndexes(context.Background()); err != nil {
		log.Fatalf("ensure user indexes: %v", err)
	}

	// DI: services layers
	userSvc := service.NewUserService(userRepo)

	// Middleware
	mws := middleware.NewAuth(userSvc, adminEmail, apiSharedSecret)

	// HTTP & Options
	r := gin.Default()
	v1.Regsiter(r, userSvc, v1.Options{
		MW:              mws,
		AdminEmail:      adminEmail,
		ApiSharedSecret: apiSharedSecret,
	})

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("failed to run server: %v", err)
	}
}
