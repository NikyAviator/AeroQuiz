package repository

import (
	"context"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// UserRepository defines the interface for user repository operations
type UserRepository interface {
	// Define your methods here, e.g., CreateUser, GetUserByID, etc.
}

type MongoUserRepository struct {
	coll *mongo.Collection
}

// NewMongoUserRepository creates a new instance of MongoUserRepository
func NewMongoUserRepository(db *mongo.Database) *MongoUserRepository {
	return &MongoUserRepository{coll: db.Collection("users")}
}

// EnsureIndexes creates necessary indexes for the users collection
func (r *MongoUserRepository) EnsureIndexes(ctx context.Context) error {
	models := []mongo.IndexModel{
		{Keys: bson.D{{Key: "email", Value: 1}}, Options: options.Index().SetUnique(true)},
	}
	_, err := r.coll.Indexes().CreateMany(ctx, models)
	return err
}
