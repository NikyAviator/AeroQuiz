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
		auth.POST("/register", controllers.RegisterController(userSvc))              // Auth endpoint: /api/v1/auth/register
		auth.POST("/login", controllers.LoginController(userSvc, opts.CookieSecure)) // Auth endpoint: /api/v1/auth/login
		// Logout clears the httpOnly cookie — no JWT check needed,
		// clearing an already-absent cookie is harmless.
		auth.POST("/logout", controllers.LogoutController()) // Auth endpoint: /api/v1/auth/logout
	}

	// Protected routes — valid httpOnly JWT cookie required
	protected := api.Group("/")
	protected.Use(opts.MW.Authn)
	{
		// Future endpoints:
		protected.GET("/me", controllers.MeController(userSvc)) // Protected endpoint: /api/v1/me
		// protected.GET("/quiz", controllers.ListQuizzesController(quizSvc))
	}

	// Admin routes — valid JWT + admin email required
	admin := api.Group("/admin")
	admin.Use(opts.MW.Authn, opts.MW.AdminOnly)
	{
		// Future admin endpoints
	}
}
