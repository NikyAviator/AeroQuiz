package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// Question is the MongoDB document stored in the "questions" collection.
// One document per question — subject, text, image (optional), answers, correct answer.
type Question struct {
	ID        bson.ObjectID `bson:"_id,omitempty" json:"id"`
	Subject   string        `bson:"subject"   json:"subject"`   // "Meteorology", "Air Law", "Principles of Flight" etc
	Text      string        `bson:"text"      json:"text"`      // The question text
	ImageURL  string        `bson:"imageUrl"  json:"imageUrl"`  // optional — empty string if no image. URL points to GCP bucket.
	Answers   []Answer      `bson:"answers"   json:"answers"`   // always 4 for multiple choice, 2 for True/False
	Correct   string        `bson:"correct"   json:"correct"`   // "A", "B", "C", "D" — NEVER sent to frontend during an active test
	CreatedAt time.Time     `bson:"createdAt" json:"createdAt"` // when the question was added to the DB
}

// Answer represents one of the multiple choice options on a question.
// Key is "A", "B", "C" or "D". Text is always present — even for True/False
// where Text will be "True" or "False".
// This is NOT the user's answer — see UserAnswer in user_result.go for that.
type Answer struct {
	Key  string `bson:"key"  json:"key"`  // "A", "B", "C", "D"
	Text string `bson:"text" json:"text"` // The answer text — always required
}

// QuestionPublic is what we send to the frontend during an active quiz session.
// The Correct field is intentionally stripped out — never expose the answer
// while the user is still answering. Only revealed after submission.
type QuestionPublic struct {
	ID       bson.ObjectID `json:"id"`
	Subject  string        `json:"subject"`
	Text     string        `json:"text"`
	ImageURL string        `json:"imageUrl"`
	Answers  []Answer      `json:"answers"`
}

// ToPublic converts a Question to QuestionPublic, dropping the correct answer.
func (q *Question) ToPublic() QuestionPublic {
	return QuestionPublic{
		ID:       q.ID,
		Subject:  q.Subject,
		Text:     q.Text,
		ImageURL: q.ImageURL,
		Answers:  q.Answers,
	}
}
