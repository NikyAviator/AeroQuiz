package cmd

import (
	"context"
	"log"
	"time"

	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/repository"
	"github.com/NikyAviator/AeroQuiz/backend/shared/env"
	sharedmongo "github.com/NikyAviator/AeroQuiz/backend/shared/mongo"
)

func main() {
	// DB Config (loads from env)
	mongoURI := env.GetString("MONGODB_URI", "mongodb://localhost:27017")
	dbName := env.GetString("MONGODB_DBNAME", "aeroquiz")
	port := env.GetString("PORT", "5000")
	adminEmail := env.GetString("ADMIN_EMAIL", "")
	apiSharedSecret := env.GetString("API_SHARED_SECRET", "")

	// Mongo connect
	_, db, closeMongo, err := sharedmongo.ConnectMongoDB(context.Background(), sharedmongo.MongoConfig{
		URI:         mongoURI,
		DBName:      dbName,
		ConnTimeout: 30 * time.Second,
	})
	if err != nil {
		log.Fatal("mongo connect:", err)
	}
	defer func() { _ = closeMongo(context.Background()) }()

	// DI: repo layers
	userRepo := repository.NewMongoUserRepository(db)

	// Ensure indexes
	if err := userRepo.EnsureIndexes(context.Background()); err != nil {
		log.Fatal("ensure user indexes:", err)
	}
}
