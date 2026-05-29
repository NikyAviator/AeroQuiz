// AeroQuiz. Package repository contains the data access layer for the quiz-service. It defines interfaces and concrete implementations for interacting with the database (MongoDB in this case).
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

type MongoUserRepository struct {
	// coll is the MongoDB collection for users.
	coll *mongo.Collection
}

// NewMongoUserRepository creates a new MongoUserRepository with the given MongoDB database.
func NewMongoUserRepository(db *mongo.Database) *MongoUserRepository {
	return &MongoUserRepository{coll: db.Collection("users")}
}

// EnsureIndexes creates necessary indexes for the users collection, such as a unique index on email.
func (repo *MongoUserRepository) EnsureIndexes(ctx context.Context) error {
	models := []mongo.IndexModel{
		{Keys: bson.D{{Key: "email", Value: 1}}, Options: options.Index().SetUnique(true)},
	}
	_, err := repo.coll.Indexes().CreateMany(ctx, models)
	return err
}

// Create saves a new user to the database. It returns an error if the operation fails (e.g., due to duplicate email).
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

// FindByEmail retrieves a user by their email address. It returns the user or an error if not found.
func (repo *MongoUserRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	var user domain.User
	err := repo.coll.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// ValidateCredentials checks if the provided email and password match a user in the database.
// It returns the user ID if valid, or an error if invalid.
func (repo *MongoUserRepository) ValidateCredentials(ctx context.Context, email, password string) (string, error) {
	var user domain.User

	err := repo.coll.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		return "", err
	}

	if !utils.CheckPasswordHash(password, user.PasswordHash) {
		return "", errors.New("invalid credentials")
	}
	return user.ID.Hex(), nil
}
