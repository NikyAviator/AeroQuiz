package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type QuizResult string

const (
	ResultPass          QuizResult = "PASS"             // score >= 15
	ResultDidNotPass    QuizResult = "DID_NOT_PASS"     // score < 15
	ResultDNFPassed     QuizResult = "DNF_PASSED"       // DNF = Did Not Finish — the user started the quiz but didn't submit an answer for all 20 questions before time ran out. We still want to record their result, passing is still possible if they got 15+ correct before time ran out.
	ResultDNFDidNotPass QuizResult = "DNF_DID_NOT_PASS" // same as above but they got < 15 correct before time ran out.
)

// SubmitAnswer is one answer sent by the frontend at submission time.
// The frontend sends questionId + given — the backend determines if it's correct.
type SubmitAnswer struct {
	QuestionID string `json:"questionId" binding:"required"`
	Given      string `json:"given"      binding:"required"`
}

// SubmitQuizRequest is the full payload sent when a user submits or time runs out.
type SubmitQuizRequest struct {
	Subject   string         `json:"subject"   binding:"required"`
	Answers   []SubmitAnswer `json:"answers"   binding:"required"`
	TimeTaken int            `json:"timeTaken" binding:"required"` // seconds elapsed
	DNF       bool           `json:"dnf"`                          // true if time ran out before user submitted
}

type UserResult struct {
	ID          bson.ObjectID  `bson:"_id,omitempty" json:"id"`
	UserID      bson.ObjectID  `bson:"userId"        json:"userId"`      // Which user took the quiz?
	Subject     string         `bson:"subject"       json:"subject"`     // which subject was tested
	Answers     []SubmitAnswer `bson:"answers"       json:"answers"`     // all 20 answers
	Score       int            `bson:"score"         json:"score"`       // 0-20
	Passed      bool           `bson:"passed"        json:"passed"`      // score >= 15
	Result      QuizResult     `bson:"result"        json:"result"`      // PASS, DID_NOT_PASS, DNF_PASSED, DNF_DID_NOT_PASS
	StartedAt   time.Time      `bson:"startedAt"     json:"startedAt"`   // when the quiz was started
	SubmittedAt time.Time      `bson:"submittedAt"   json:"submittedAt"` // zero if DNF
	TimeTaken   int            `bson:"timeTaken"     json:"timeTaken"`   // seconds elapsed
}
