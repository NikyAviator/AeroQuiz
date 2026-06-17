package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Question struct {
	ID        bson.ObjectID `bson:"_id,omitempty" json:"id"`
	Subject   string        `bson:"subject"  json:"subject"`    // "Meteorology", "Air Law" etc
	Text      string        `bson:"text"     json:"text"`       // The question text
	ImageURL  string        `bson:"imageUrl" json:"imageUrl"`   // optional — empty string if no image (Saved in GCP bucket, URL is public)
	Answers   []Answer      `bson:"answers"  json:"answers"`    // always 4, sometimes 2 (T/F)
	Correct   string        `bson:"correct"  json:"correct"`    // "A", "B", "C", "D" — never sent to frontend during a test!
	CreatedAt time.Time     `bson:"createdAt" json:"createdAt"` // When the question was created
}

// Are these the results we send when the user submits all the answer at the end of the quiz?
// In that case can we call it: UserAnswers?
type Answer struct {
	Key  string `bson:"key"  json:"key"`  // "A", "B", "C", "D"
	Text string `bson:"text" json:"text"` // optional - The answer text
}
