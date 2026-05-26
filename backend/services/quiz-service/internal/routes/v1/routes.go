package v1

import (
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/controllers"
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/middleware"
	"github.com/gin-gonic/gin"
)

// RegisterRoutes attaches all v1 routes to the provided router group.
// Dependency injection keeps this function free of any construction logic.
func RegisterRoutes(rg *gin.RouterGroup, userCtrl *controllers.UserController) {
	// Public routes — no auth required
	auth := rg.Group("/auth")
	{
		auth.POST("/register", userCtrl.Register)
		auth.POST("/login", userCtrl.Login)
	}

	// Protected routes — JWT required
	protected := rg.Group("/")
	protected.Use(middleware.RequireAuth())
	{
		// Future protected endpoints go here, e.g.:
		// protected.GET("/me", userCtrl.Me)
	}
}
