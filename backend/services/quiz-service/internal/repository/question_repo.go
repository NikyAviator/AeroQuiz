// Package repository - question data access layer for quiz-service.
// Handles inserting and retrieving quiz questions from MongoDB (questions collection).
package repository

import (
	"context"

	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/domain"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type QuestionRepository interface {
	InsertOne(ctx context.Context, q *domain.Question) error
	InsertMany(ctx context.Context, qs []domain.Question) error
	GetRandom(ctx context.Context, subject string, count int) ([]domain.Question, error)
	FindQByID(ctx context.Context, id bson.ObjectID) (*domain.Question, error)
}

// MongoQuestionRepository implements QuestionRepository using MongoDB.
type MongoQuestionRepository struct {
	coll *mongo.Collection
}

// NewMongoQuestionRepository wires the repo to the "questions" collection.
func NewMongoQuestionRepository(db *mongo.Database) *MongoQuestionRepository {
	return &MongoQuestionRepository{coll: db.Collection("questions")}
}

// EnsureIndexes creates necessary indexes at startup.
// For example, an index on "subject" can speed up random retrieval by subject.
func (repo *MongoQuestionRepository) EnsureIndexes(ctx context.Context) error {
	models := []mongo.IndexModel{
		{Keys: bson.D{{Key: "subject", Value: 1}}},
	}
	_, err := repo.coll.Indexes().CreateMany(ctx, models)
	return err
}

// InsertOne adds a single question document to the collection.
func (repo *MongoQuestionRepository) InsertOne(ctx context.Context, q *domain.Question) error {
	res, err := repo.coll.InsertOne(ctx, q)
	if err != nil {
		return err
	}
	// Write the generated ObjectID back onto the struct.
	if oid, ok := res.InsertedID.(bson.ObjectID); ok {
		q.ID = oid
	}
	return nil

}

// InsertMany adds multiple question in a single operation.
func (repo *MongoQuestionRepository) InsertMany(ctx context.Context, qs []domain.Question) error {
	docs := make([]interface{}, len(qs))

	for i := range qs {
		docs[i] = qs[i]
	}
	_, err := repo.coll.InsertMany(ctx, docs)
	return err
}

// GetRandom retrieves a specified number of random questions for a given subject.
// Uses MongoDB's $sample aggregation stage for efficient random selection.
func (repo *MongoQuestionRepository) GetRandom(ctx context.Context, subject string, count int) ([]domain.Question, error) {

	pipeline := mongo.Pipeline{
		// 1. Filter by subject.
		{{Key: "$match", Value: bson.D{{Key: "subject", Value: subject}}}},
		// 2. Randomly sample 'count' documents.
		{{Key: "$sample", Value: bson.D{{Key: "size", Value: count}}}},
	}

	cursor, err := repo.coll.Aggregate(ctx, pipeline, options.Aggregate())
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var questions []domain.Question
	if err := cursor.All(ctx, &questions); err != nil {
		return nil, err
	}
	return questions, nil
}

// FindQByID retrieves a single question (and its details) by its ObjectID.
func (repo *MongoQuestionRepository) FindQByID(ctx context.Context, id bson.ObjectID) (*domain.Question, error) {

	var question domain.Question

	err := repo.coll.FindOne(ctx, bson.M{"_id": id}).Decode(&question)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &question, nil
}
