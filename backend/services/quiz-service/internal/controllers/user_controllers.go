// Package controllers contains the HTTP handlers for user-related endpoints (registration, login). For AeroQuiz: quiz-service.
package controllers

import (
	"net/http"

	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/domain"
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/service"
	"github.com/gin-gonic/gin"
)

// UserController holds a reference to the service layer.
// It is responsible only for HTTP concerns — binding, status codes, responses.
type UserController struct {
	userService *service.UserService
}

// NewUserController constructs a UserController with its service injected.
func NewUserController(userService *service.UserService) *UserController {
	return &UserController{userService: userService}
}

// Register godoc
// POST /api/v1/register
func (uc *UserController) Register(c *gin.Context) {
	var req domain.RegisterRequest

	// ShouldBindJSON validates the struct tags (required, email, min=8)
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := uc.userService.RegisterUser(c.Request.Context(), req)
	if err != nil {
		// "email already registered" is a client error; everything else is a server error
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
// POST /api/v1/login
func (uc *UserController) Login(c *gin.Context) {
	var req domain.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := uc.userService.LoginUser(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
