// Package repository contains the data access layer for the quiz-service.
// It defines interfaces and concrete MongoDB implementations.
// The service layer depends on the interface — never the concrete type.
package repository

import (
	"context"
	"errors"

	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/domain"
	"github.com/NikyAviator/AeroQuiz/backend/shared/utils"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// UserRepository defines the interface for user data operations.
// The service layer depends on this interface, not the concrete type —
// this makes it easy to swap implementations or mock in tests.
type UserRepository interface {
	Create(ctx context.Context, user *domain.User) error
	FindByEmail(ctx context.Context, email string) (*domain.User, error)
	ValidateCredentials(ctx context.Context, email, password string) (string /* userID */, error)
}

// MongoUserRepository is the MongoDB implementation of UserRepository.
type MongoUserRepository struct {
	coll *mongo.Collection
}

// NewMongoUserRepository wires the repository to the "users" collection.
func NewMongoUserRepository(db *mongo.Database) *MongoUserRepository {
	return &MongoUserRepository{coll: db.Collection("users")}
}

// EnsureIndexes creates a unique index on email at startup.
// Safe to call on every startup — MongoDB is idempotent on existing indexes.
func (repo *MongoUserRepository) EnsureIndexes(ctx context.Context) error {
	models := []mongo.IndexModel{
		{Keys: bson.D{{Key: "email", Value: 1}}, Options: options.Index().SetUnique(true)},
	}
	_, err := repo.coll.Indexes().CreateMany(ctx, models)
	return err
}

// Create inserts a new user document and writes the generated ObjectID back onto the struct.
func (repo *MongoUserRepository) Create(ctx context.Context, user *domain.User) error {
	res, err := repo.coll.InsertOne(ctx, user)
	if err != nil {
		return err
	}
	if oid, ok := res.InsertedID.(bson.ObjectID); ok {
		user.ID = oid
	}
	return nil
}

// FindByEmail retrieves a user by email.
// Returns nil, nil when the user does not exist — callers must check for nil
// to distinguish "not found" from a real database error.
func (repo *MongoUserRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	var user domain.User
	err := repo.coll.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, nil // not found — not an error
	}
	if err != nil {
		return nil, err // real DB error
	}
	return &user, nil
}

// ValidateCredentials looks up the user by email and verifies the password hash.
// Returns the hex user ID on success.
func (repo *MongoUserRepository) ValidateCredentials(ctx context.Context, email, password string) (string, error) {
	var user domain.User
	err := repo.coll.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return "", errors.New("invalid credentials")
	}
	if err != nil {
		return "", err
	}
	if !utils.CheckPasswordHash(password, user.PasswordHash) {
		return "", errors.New("invalid credentials")
	}
	return user.ID.Hex(), nil
}
