// Package domain contains the core data structures for the quiz-service, such as User and request payloads. This is where we define the shape of our data and any related validation tags.
package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type User struct {
	ID           bson.ObjectID `json:"id"        bson:"_id,omitempty"`
	Email        string        `json:"email"     bson:"email"         binding:"required"`
	UserName     string        `json:"username"  bson:"username"      binding:"required"`
	PasswordHash string        `json:"-"         bson:"passwordHash"`
	IsAdmin      bool          `json:"isAdmin"   bson:"isAdmin"`
	CreatedAt    time.Time     `json:"createdAt" bson:"createdAt"`
	UpdatedAt    time.Time     `json:"updatedAt" bson:"updatedAt"`
}

// RegisterRequest is the payload the client sends to /api/v1/register
type RegisterRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	UserName string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required,min=8"`
}

// LoginRequest is the payload the client sends to /api/v1/login
type LoginRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required"`
}
