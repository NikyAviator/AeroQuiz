// Package controllers — HTTP handlers for quiz-related endpoints.
// Controllers handle HTTP concerns only (binding, status codes, responses).
// All business logic lives in quiz_service.go.
package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/domain"
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/service"
	"github.com/gin-gonic/gin"
)

// ── Admin — add questions ──────────────────────────────────────────────────────

// AddQuestionController handles POST /api/v1/admin/questions
// Adds a single question to the bank. Admin only.
func AddQuestionController(svc service.QuizService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var q domain.Question
		if err := c.ShouldBindJSON(&q); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
		defer cancel()

		if err := svc.AddQuestion(ctx, &q); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not add question"})
			return
		}

		c.JSON(http.StatusCreated, q)
	}
}

// AddQuestionsController handles POST /api/v1/admin/questions/batch
// Adds many questions in one request — used to load your Meteorology book.
func AddQuestionsController(svc service.QuizService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var qs []domain.Question
		if err := c.ShouldBindJSON(&qs); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		ctx, cancel := context.WithTimeout(c.Request.Context(), 30*time.Second) // batch — longer timeout
		defer cancel()

		if err := svc.AddQuestions(ctx, qs); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not add questions"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"inserted": len(qs)})
	}
}

// ── Quiz flow — protected ──────────────────────────────────────────────────────

// StartQuizController handles GET /api/v1/quiz/start?subject=Meteorology
// Returns QuestionsPerQuiz random questions for the requested subject,
// with the correct answer stripped out.
func StartQuizController(svc service.QuizService) gin.HandlerFunc {
	return func(c *gin.Context) {
		subject := c.Query("subject")
		if subject == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "subject query param is required"})
			return
		}

		ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
		defer cancel()

		questions, err := svc.StartQuiz(ctx, subject)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not start quiz"})
			return
		}

		c.JSON(http.StatusOK, questions)
	}
}

// SubmitQuizController handles POST /api/v1/quiz/submit
// Receives the user's answers, grades them, and saves the result.
func SubmitQuizController(svc service.QuizService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req domain.SubmitQuizRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// userId was stashed on the context by the Authn middleware
		userID := c.GetString("userId")
		if userID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "not authenticated"})
			return
		}

		ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
		defer cancel()

		result, err := svc.SubmitQuiz(ctx, userID, req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not submit quiz"})
			return
		}

		c.JSON(http.StatusOK, result)
	}
}

// ── History — protected ────────────────────────────────────────────────────────

// GetHistoryController handles GET /api/v1/quiz/history
// Returns all quiz results for the logged-in user.
func GetHistoryController(svc service.QuizService) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetString("userId")
		if userID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "not authenticated"})
			return
		}

		ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
		defer cancel()

		results, err := svc.GetHistory(ctx, userID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch history"})
			return
		}

		c.JSON(http.StatusOK, results)
	}
}

// GetResultController handles GET /api/v1/quiz/history/:id
// Returns one specific result with full answer breakdown.
func GetResultController(svc service.QuizService) gin.HandlerFunc {
	return func(c *gin.Context) {
		resultID := c.Param("id")
		if resultID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "result id is required"})
			return
		}

		ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
		defer cancel()

		result, err := svc.GetResult(ctx, resultID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch result"})
			return
		}
		if result == nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "result not found"})
			return
		}

		c.JSON(http.StatusOK, result)
	}
}
