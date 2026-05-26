// Package middleware contains Gin middleware functions for the quiz-service, such as authentication and logging.
// This is where we can define reusable middleware that can be applied to routes or groups of routes.
package middleware

import (
	"net/http"
	"strings"

	"github.com/NikyAviator/AeroQuiz/backend/shared/utils"
	"github.com/gin-gonic/gin"
)

// RequireAuth is a Gin middleware that validates the JWT in the
// Authorization: Bearer <token> header and injects the claims into the context.
func RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing authorization header"})
			return
		}

		// Expect "Bearer <token>"
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid authorization format"})
			return
		}

		claims, err := utils.VerifyToken(parts[1])
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
			return
		}

		// Make claims available downstream via c.Get("userId") / c.Get("email")
		c.Set("userId", claims["userId"])
		c.Set("email", claims["email"])
		c.Next()
	}
}
