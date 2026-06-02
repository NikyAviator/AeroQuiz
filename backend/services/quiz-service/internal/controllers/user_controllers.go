// Package controllers contains the HTTP handlers for user-related endpoints
// (registration, login). For AeroQuiz: quiz-service.
// Controllers are responsible only for HTTP concerns — binding, status codes,
// responses. All business logic lives in the service layer.
package controllers

import (
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/domain"
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/service"
	"github.com/gin-gonic/gin"
)

func CreateUserController(svc service.UserService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var loginRequest domain.LoginRequest
		if err := c.ShouldBindJSON(&loginRequest); err != nil {
			c.JSON(400, gin.H{"error": "invalid payload"})
			return
		}
		created, err := svc.CreateUser(c.Request.Context(), loginRequest)
		if err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(201, created)
	}
}

func LoginController(userSvc service.UserService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var loginRequest domain.LoginRequest
		if err := c.ShouldBindJSON(&loginRequest); err != nil {
			c.JSON(400, gin.H{"error": "invalid payload"})
			return
		}
		token, err := userSvc.LoginUser(c.Request.Context(), loginRequest)
		if err != nil {
			c.JSON(401, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"token": token})
	}
}
