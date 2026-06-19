// Package repository - user result data access layer for quiz-service.
// Handles inserting and retrieving user quiz results from MongoDB.
package repository

import (
	"context"

	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/domain"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// UserResultRepository defines the interface for quiz result data operations.
type UserResultRepository interface {
	Save(ctx context.Context, result *domain.UserResult) error
	FindByUserID(ctx context.Context, userID bson.ObjectID) ([]domain.UserResult, error)
	FindByID(ctx context.Context, id bson.ObjectID) (*domain.UserResult, error)
}

// MongoUserResultRepository is a MongoDB implementation of UserResultRepository.
type MongoUserResultRepository struct {
	coll *mongo.Collection
}

// NewMongoUserResultRepository wires the repo to the "user_results" collection.
func NewMongoUserResultRepository(db *mongo.Database) *MongoUserResultRepository {
	return &MongoUserResultRepository{coll: db.Collection("user_results")}
}

// EnsureIndexes creates necessary indexes for the user_results collection.
func (r *MongoUserResultRepository) EnsureIndexes(ctx context.Context) error {
	models := []mongo.IndexModel{
		{Keys: bson.D{{Key: "userId", Value: 1}}},
	}

	_, err := r.coll.Indexes().CreateMany(ctx, models)
	return err

}

// Save inserts a completed quiz result into the collection (user_results).
func (r *MongoUserResultRepository) Save(ctx context.Context, result *domain.UserResult) error {
	res, err := r.coll.InsertOne(ctx, result)

	if err != nil {
		return err
	}
	if oid, ok := res.InsertedID.(bson.ObjectID); ok {
		result.ID = oid
	}
	return nil
}

// FindByUserID retrieves all quiz results for a user, newest first.
// User by the History page to show a user's full test history.
func (r *MongoUserResultRepository) FindByUserID(ctx context.Context, userID bson.ObjectID) ([]domain.UserResult, error) {
	opts := options.Find().SetSort(bson.D{{Key: "startedAt", Value: -1}}) // Sort by newest first

	cursor, err := r.coll.Find(ctx, bson.M{"userId": userID}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var results []domain.UserResult
	if err := cursor.All(ctx, &results); err != nil {
		return nil, err
	}
	return results, nil
}

// FindByID retrieves a single result by its ID.
// Used by the result details page to show full answer breakdown.
func (r *MongoUserResultRepository) FindByID(ctx context.Context, id bson.ObjectID) (*domain.UserResult, error) {

	var result domain.UserResult

	err := r.coll.FindOne(ctx, bson.M{"_id": id}).Decode(&result)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &result, nil
}
