// This is the main entry point for the quiz-service. It sets up the HTTP server, connects to MongoDB, and wires up the routes and controllers.
package main

import (
	"context"
	"log"
	"time"

	"github.com/NikyAviator/AeroQuiz/backend/shared/env"
	sharedmongo "github.com/NikyAviator/AeroQuiz/backend/shared/mongo"
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
	defer func() {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := closeMongo(ctx); err != nil {
			log.Printf("mongo disconnect error: %v", err)
		}
	}()

}
