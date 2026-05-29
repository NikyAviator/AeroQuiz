// Package controllers contains the HTTP handlers for user-related endpoints
// (registration, login). For AeroQuiz: quiz-service.
// Controllers are responsible only for HTTP concerns — binding, status codes,
// responses. All business logic lives in the service layer.
package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/domain"
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/service"
	"github.com/gin-gonic/gin"
)

// UserController holds a reference to the service layer via its interface.
// Depending on the interface (not the concrete struct) keeps the layers
// decoupled and makes the controller easy to test with a mock service.
type UserController struct {
	userService service.UserServiceInterface
}

// NewUserController constructs a UserController with its service injected.
func NewUserController(userService service.UserServiceInterface) *UserController {
	return &UserController{userService: userService}
}

// Register godoc
// POST /api/v1/auth/register
func (uc *UserController) Register(c *gin.Context) {
	var req domain.RegisterRequest

	// ShouldBindJSON validates the struct tags (required, email, min=8)
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Timeout: don't let a slow DB hang this goroutine forever
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	user, err := uc.userService.RegisterUser(ctx, req)
	if err != nil {
		if err.Error() == "email already registered" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not register user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":        user.ID.Hex(),
		"email":     user.Email,
		"username":  user.UserName,
		"isAdmin":   user.IsAdmin,
		"createdAt": user.CreatedAt,
	})
}

// Login godoc
// POST /api/v1/auth/login
func (uc *UserController) Login(c *gin.Context) {
	var req domain.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Timeout: bcrypt + DB round-trip should never take more than 10s
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	token, err := uc.userService.LoginUser(ctx, req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
