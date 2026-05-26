// Package repository contains the data access layer for the quiz-service. It defines interfaces and concrete implementations for interacting with the database (MongoDB in this case).
package repository

import (
	"context"
	"errors"

	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/domain"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// UserRepository defines the interface for user data operations.
// The service layer depends on this interface, not the concrete type —
// this makes it easy to swap implementations or mock in tests.
type UserRepository interface {
	CreateUser(ctx context.Context, user *domain.User) error
	FindByEmail(ctx context.Context, email string) (*domain.User, error)
}

type MongoUserRepository struct {
	coll *mongo.Collection
}

// NewMongoUserRepository creates a new MongoUserRepository wired to the
// "users" collection inside the provided database.
func NewMongoUserRepository(db *mongo.Database) *MongoUserRepository {
	return &MongoUserRepository{coll: db.Collection("users")}
}

// EnsureIndexes creates a unique index on the email field so MongoDB
// enforces uniqueness at the database level as a safety net.
func (r *MongoUserRepository) EnsureIndexes(ctx context.Context) error {
	models := []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "email", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
	}
	_, err := r.coll.Indexes().CreateMany(ctx, models)
	return err
}

// CreateUser inserts a new user document into the collection.
func (r *MongoUserRepository) CreateUser(ctx context.Context, user *domain.User) error {
	_, err := r.coll.InsertOne(ctx, user)
	return err
}

// FindByEmail retrieves a user by their email address.
// Returns nil, nil if the user is not found — callers should check for nil.
func (r *MongoUserRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	var user domain.User
	err := r.coll.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &user, nil
}
