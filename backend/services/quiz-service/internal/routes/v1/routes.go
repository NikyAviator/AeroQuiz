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
func Register(r *gin.Engine, userSvc service.UserService, opts Options) {
	api := r.Group("/api/v1")

	// Public auth routes — no JWT required
	auth := api.Group("/auth")
	{
		auth.POST("/register", controllers.RegisterController(userSvc))
		auth.POST("/login", controllers.LoginController(userSvc, opts.CookieSecure))
	}

	// Protected routes — JWT required
	protected := api.Group("/")
	protected.Use(opts.MW.Authn)
	{
		// Future endpoints go here e.g.:
		// protected.GET("/me", controllers.MeController(userSvc))
		// protected.GET("/quiz", controllers.ListQuizzesController(quizSvc))
	}

	// Admin routes — JWT + admin check required
	admin := api.Group("/admin")
	admin.Use(opts.MW.Authn, opts.MW.AdminOnly)
	{
		// Future admin endpoints go here
	}
}
