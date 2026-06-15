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

const cookieName = "auth_token"
const cookieMaxAge = 7 * 24 * 60 * 60 // 7 days in seconds

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
func LoginController(svc service.UserService, cookieSecure bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req domain.LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
		defer cancel()

		token, user, err := svc.LoginUser(ctx, req)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
			return
		}

		// Set the JWT as an httpOnly cookie.
		// SameSite=Strict: cookie is only sent on same-site requests (no CSRF risk).
		// Secure=true in production (HTTPS), false in dev (HTTP).
		// HttpOnly=true: JS cannot read this cookie (XSS protection).
		http.SetCookie(c.Writer, &http.Cookie{
			Name:     cookieName,
			Value:    token,
			MaxAge:   cookieMaxAge,
			Path:     "/",
			HttpOnly: true,
			Secure:   cookieSecure,
			SameSite: http.SameSiteStrictMode,
		})

		// Return user info in the body — frontend uses this for the greeting.
		// The token itself stays in the cookie and is never exposed to JS.
		c.JSON(http.StatusOK, user)
	}
}
