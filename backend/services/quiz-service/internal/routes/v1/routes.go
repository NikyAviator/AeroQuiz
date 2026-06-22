// Package v1 defines the API routes for version 1 of the quiz-service.
package v1

import (
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/controllers"
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/middleware"
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/service"
	"github.com/gin-gonic/gin"
)

// Options carries config and middleware into the router — keeps Register() pure.
type Options struct {
	MW              middleware.Auth
	AdminEmail      string
	ApiSharedSecret string
	CookieSecure    bool // false in dev (HTTP), true in prod (HTTPS). Set via env var.
}

// Register wires all v1 routes onto the engine.
// quizSvc is now a required dependency alongside userSvc.
func Register(r *gin.Engine, userSvc service.UserService, quizSvc service.QuizService, opts Options) {
	api := r.Group("/api/v1")

	// ── Public auth routes — no JWT required ──────────────────────────────────
	auth := api.Group("/auth")
	{
		auth.POST("/register", controllers.RegisterController(userSvc))
		auth.POST("/login", controllers.LoginController(userSvc, opts.CookieSecure))
		auth.POST("/logout", controllers.LogoutController())
	}

	// ── Protected routes — valid httpOnly JWT cookie required ────────────────
	protected := api.Group("/")
	protected.Use(opts.MW.Authn)
	{
		protected.GET("/me", controllers.MeController(userSvc))

		// Quiz flow
		protected.GET("/quiz/start", controllers.StartQuizController(quizSvc))
		protected.POST("/quiz/submit", controllers.SubmitQuizController(quizSvc))

		// History
		protected.GET("/quiz/history", controllers.GetHistoryController(quizSvc))
		protected.GET("/quiz/history/:id", controllers.GetResultController(quizSvc))
	}

	// ── Admin routes — valid JWT + admin email required ───────────────────────
	admin := api.Group("/admin")
	admin.Use(opts.MW.Authn, opts.MW.AdminOnly)
	{
		admin.POST("/questions", controllers.AddQuestionController(quizSvc))
		admin.POST("/questions/batch", controllers.AddQuestionsController(quizSvc))
	}
}
