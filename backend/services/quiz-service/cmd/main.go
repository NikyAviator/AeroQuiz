package cmd

import "github.com/NikyAviator/AeroQuiz/backend/shared/env"

func main() {
	// DB Config (loads from env)
	mongoURI := env.GetString("MONGODB_URI", "mongodb://localhost:27017")
	dbName := env.GetString("MONGODB_DBNAME", "aeroquiz")
	port := env.GetString("PORT", "5000")
	adminEmail := env.GetString("ADMIN_EMAIL", "")
	apiSharedSecret := env.GetString("API_SHARED_SECRET", "")

	// Mongo connect

}
