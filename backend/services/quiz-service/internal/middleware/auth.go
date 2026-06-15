// Package middleware contains Gin middleware for the quiz-service.
// auth.go provides JWT authentication (via httpOnly cookie), admin-only
// guard, request timeout, and API shared-secret validation.
package middleware

import (
	"context"
	"net/http"
	"time"

	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/service"
	"github.com/NikyAviator/AeroQuiz/backend/shared/utils"
	"github.com/gin-gonic/gin"
)

// Auth bundles all middleware handlers for dependency injection.
type Auth struct {
	Authn           gin.HandlerFunc // reads JWT from httpOnly cookie
	AdminOnly       gin.HandlerFunc // ensures caller is the admin
	Timeout         func(time.Duration) gin.HandlerFunc
	ApiSharedSecret gin.HandlerFunc // ensures request came through nginx
}

// NewAuth wires all middleware with their dependencies.
func NewAuth(userSvc service.UserService, adminEmail string, apiSharedSecret string) Auth {

	// 1) Authn — reads the JWT from the httpOnly cookie set at login.
	// JavaScript cannot access this cookie, which eliminates XSS token theft.
	// The middleware extracts the claims and stashes them on the Gin context
	// for downstream handlers to use via c.GetString("userEmail") etc.
	authn := func(c *gin.Context) {
		token, err := c.Cookie("auth_token")
		if err != nil {
			// Cookie absent — user is not logged in
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "not authenticated"})
			return
		}

		claims, err := utils.VerifyToken(token)
		if err != nil {
			// Cookie present but token is invalid or expired
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired session"})
			return
		}

		if v, ok := claims["email"].(string); ok {
			c.Set("userEmail", v)
		}
		if v, ok := claims["userId"].(string); ok {
			c.Set("userId", v)
		}
		c.Next()
	}

	// 2) AdminOnly — must run after Authn (depends on claims being in context).
	// Checks the email in the JWT claims against the configured admin email.
	adminOnly := func(c *gin.Context) {
		email := c.GetString("userEmail")
		id := c.GetString("userId")
		if email == "" || id == "" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "missing claims"})
			return
		}
		if email != adminEmail {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "not admin"})
			return
		}
		c.Next()
	}

	// 3) Timeout — wraps the request in a deadline so slow DB calls don't
	// hold a goroutine open forever.
	timeout := func(d time.Duration) gin.HandlerFunc {
		return func(c *gin.Context) {
			ctx, cancel := context.WithTimeout(c.Request.Context(), d)
			defer cancel()
			c.Request = c.Request.WithContext(ctx)
			c.Next()
			if ctx.Err() == context.DeadlineExceeded && !c.IsAborted() {
				c.AbortWithStatusJSON(http.StatusGatewayTimeout, gin.H{"error": "request timed out"})
			}
		}
	}

	// 4) ApiSharedSecret — validates that the request arrived via nginx.
	// nginx injects X-API-SECRET on every proxied request (see nginx.local.template.conf).
	// Direct hits to the backend pod bypass nginx and therefore lack this header.
	// Apply this middleware to routes you want to lock down to the nginx→backend path only.
	apiSecret := func(c *gin.Context) {
		if c.GetHeader("X-API-SECRET") != apiSharedSecret {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		c.Next()
	}

	return Auth{
		Authn:           authn,
		AdminOnly:       adminOnly,
		Timeout:         timeout,
		ApiSharedSecret: apiSecret,
	}
}
