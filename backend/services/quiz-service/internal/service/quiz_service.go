// Package service — quiz business logic.
// Sits between quiz_controllers.go (HTTP) and the question/result repositories (DB).
// This is where grading, scoring, and pass/fail rules live.
package service

import (
	"context"

	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/domain"
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/repository"
)

// Quiz rules — defined once, used throughout the service.
const (
	QuestionsPerQuiz = 20 // how many random questions per quiz session
	PassingScore     = 15 // >= 15 out of 20 (75%) to pass
)

// QuizService is the interface the controllers depend on.
type QuizService interface {
	// Admin — add questions to the bank
	AddQuestion(ctx context.Context, q *domain.Question) error
	AddQuestions(ctx context.Context, qs []domain.Question) error

	// Quiz flow — protected, used by logged-in users
	StartQuiz(ctx context.Context, subject string) ([]domain.QuestionPublic, error)
	SubmitQuiz(ctx context.Context, userID string, req domain.SubmitQuizRequest) (*domain.UserResult, error)

	// History — protected
	GetHistory(ctx context.Context, userID string) ([]domain.UserResult, error)
	GetResult(ctx context.Context, resultID string) (*domain.UserResult, error)
}

// quizService is the concrete implementation — unexported intentionally.
type quizService struct {
	questionRepo repository.QuestionRepository
	resultRepo   repository.UserResultRepository
}

// NewQuizService constructs a quizService with its dependencies injected.
func NewQuizService(questionRepo repository.QuestionRepository, resultRepo repository.UserResultRepository) QuizService {
	return &quizService{
		questionRepo: questionRepo,
		resultRepo:   resultRepo,
	}
}

// ── AddQuestion ───────────────────────────────────────────────────────────────
// Adds a single question to the question bank. Called by the admin endpoint.
// TODO: implement
//   - set q.CreatedAt
//   - call s.questionRepo.InsertOne
func (s *quizService) AddQuestion(ctx context.Context, q *domain.Question) error {
	return nil
}

// ── AddQuestions ──────────────────────────────────────────────────────────────
// Adds a batch of questions in one operation. Used when loading your
// Meteorology book questions all at once.
// TODO: implement
//   - set CreatedAt on each question
//   - call s.questionRepo.InsertMany
func (s *quizService) AddQuestions(ctx context.Context, qs []domain.Question) error {
	return nil
}

// ── StartQuiz ─────────────────────────────────────────────────────────────────
// Fetches QuestionsPerQuiz random questions for the given subject and
// converts them to QuestionPublic (stripping the correct answer) before
// returning to the frontend.
// TODO: implement
//   - call s.questionRepo.GetRandom(ctx, subject, QuestionsPerQuiz)
//   - convert each domain.Question to QuestionPublic via q.ToPublic()
//   - return the []domain.QuestionPublic slice
func (s *quizService) StartQuiz(ctx context.Context, subject string) ([]domain.QuestionPublic, error) {
	return nil, nil
}

// ── SubmitQuiz ────────────────────────────────────────────────────────────────
// The core grading logic. Receives the user's answers, looks up the real
// correct answer for each question from the DB, grades them, determines
// the QuizResult (PASS / DID_NOT_PASS / DNF_PASSED / DNF_DID_NOT_PASS),
// and saves the UserResult.
// TODO: implement
//   - convert userID string -> bson.ObjectID (bson.ObjectIDFromHex)
//   - for each req.Answers entry:
//   - convert SubmitAnswer.QuestionID string -> bson.ObjectID
//   - fetch the real Question from DB to get the correct answer
//     (hint: you may want a new repo method, e.g. FindByID on QuestionRepository)
//   - compare Given vs Question.Correct -> build a domain.UserAnswer
//   - count the score (how many UserAnswer.Correct == true)
//   - determine Passed (score >= PassingScore) and the QuizResult enum
//     based on score + req.DNF
//   - build the domain.UserResult and call s.resultRepo.Save
//   - return the saved *domain.UserResult
func (s *quizService) SubmitQuiz(ctx context.Context, userID string, req domain.SubmitQuizRequest) (*domain.UserResult, error) {
	return nil, nil
}

// ── GetHistory ────────────────────────────────────────────────────────────────
// Returns all quiz results for the logged-in user, newest first.
// TODO: implement
//   - convert userID string -> bson.ObjectID
//   - call s.resultRepo.FindByUserID
func (s *quizService) GetHistory(ctx context.Context, userID string) ([]domain.UserResult, error) {
	return nil, nil
}

// ── GetResult ─────────────────────────────────────────────────────────────────
// Returns one specific quiz result with full answer breakdown.
// TODO: implement
//   - convert resultID string -> bson.ObjectID
//   - call s.resultRepo.FindByID
func (s *quizService) GetResult(ctx context.Context, resultID string) (*domain.UserResult, error) {
	return nil, nil
}
