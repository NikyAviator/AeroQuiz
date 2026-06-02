// Package v1 defines the API routes for version 1 of the quiz-service. This is where we group all related endpoints together and apply any route-specific middleware.
package v1

import (
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/controllers"
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/middleware"
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/service"
	"github.com/gin-gonic/gin"
)

type Options struct {
	MW              middleware.Auth
	AdminEmail      string
	ApiSharedSecret string
}

func Regsiter(
	r *gin.Engine,
	userSvc service.UserService,
	opts Options,
) {
	// Base API group
	api := r.Group("/api")
	// Internal API protection (Call needs to originate from frontend with secret)
	api.Use(opts.MW.ApiSharedSecret)

	// Public routes
	api.POST("/login", controllers.LoginController(userSvc))
}
