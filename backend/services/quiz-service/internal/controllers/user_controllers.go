// Package controllers contains the HTTP handlers for user-related endpoints.
// Controllers are responsible only for HTTP concerns — binding, status codes, responses.
// All business logic lives in the service layer.
package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/domain"
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/service"
	"github.com/gin-gonic/gin"
)

// RegisterController handles POST /api/v1/auth/register
func RegisterController(svc service.UserService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req domain.RegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
		defer cancel()

		user, err := svc.RegisterUser(ctx, req)
		if err != nil {
			if err.Error() == "email already registered" {
				c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not register user"})
			return
		}

		c.JSON(http.StatusCreated, user)
	}
}

// LoginController handles POST /api/v1/auth/login
func LoginController(svc service.UserService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req domain.LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
		defer cancel()

		token, err := svc.LoginUser(ctx, req)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"token": token})
	}
}
