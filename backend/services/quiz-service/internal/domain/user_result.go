package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type QuizResult string

const (
	ResultPass          QuizResult = "PASS"             // score >= 15
	ResultDidNotPass    QuizResult = "DID_NOT_PASS"     // score < 15
	ResultDNFPassed     QuizResult = "DNF_PASSED"       // time ran out, score >= 15
	ResultDNFDidNotPass QuizResult = "DNF_DID_NOT_PASS" // time ran out, score < 15
)

// ── Inbound (frontend → backend) ─────────────────────────────────────────────

// SubmitAnswer is ONE answer sent by the frontend at submission time.
// QuestionID is a string here because JSON doesn't know about bson.ObjectID —
// the service layer converts it to bson.ObjectID before saving.
// The backend looks up the correct answer and decides if Given was right.
type SubmitAnswer struct {
	QuestionID string `json:"questionId" binding:"required"`
	Given      string `json:"given"      binding:"required"` // "A", "B", "C", "D"
}

// SubmitQuizRequest is the full payload the frontend sends on submit or on timeout.
type SubmitQuizRequest struct {
	Subject   string         `json:"subject"   binding:"required"`
	Answers   []SubmitAnswer `json:"answers"   binding:"required"`
	TimeTaken int            `json:"timeTaken" binding:"required"` // seconds elapsed
	DNF       bool           `json:"dnf"`                          // true if time ran out before user submitted
}

// ── Stored (backend → MongoDB) ───────────────────────────────────────────────

// UserAnswer is ONE graded answer stored in MongoDB.
// Built by the service layer after grading — never sent directly from the frontend.
// Correct is computed by the backend by comparing Given against Question.Correct.
type UserAnswer struct {
	QuestionID bson.ObjectID `bson:"questionId" json:"questionId"`
	Given      string        `bson:"given"      json:"given"`   // what the user chose
	Correct    bool          `bson:"correct"    json:"correct"` // did they get it right?
}

// UserResult is the full quiz result stored in the "user_results" collection.
// Built by the service layer after grading all answers.
type UserResult struct {
	ID          bson.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID      bson.ObjectID `bson:"userId"        json:"userId"`      // which user took the quiz
	Subject     string        `bson:"subject"       json:"subject"`     // which subject was tested
	Answers     []UserAnswer  `bson:"answers"       json:"answers"`     // graded answers — stored in DB
	Score       int           `bson:"score"         json:"score"`       // 0-20
	Passed      bool          `bson:"passed"        json:"passed"`      // score >= 15
	Result      QuizResult    `bson:"result"        json:"result"`      // PASS / DID_NOT_PASS / DNF_PASSED / DNF_DID_NOT_PASS
	StartedAt   time.Time     `bson:"startedAt"     json:"startedAt"`   // when the quiz started
	SubmittedAt time.Time     `bson:"submittedAt"   json:"submittedAt"` // zero value if DNF - NOW IS SET TO time.Now().UTC() if DNF
	TimeTaken   int           `bson:"timeTaken"     json:"timeTaken"`   // seconds elapsed
}
