// Package domain contains the core data structures for the quiz-service.
// This is the foundation — all other layers depend on these types.
package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// User is the MongoDB document stored in the "users" collection.
type User struct {
	ID           bson.ObjectID `json:"id"        bson:"_id,omitempty"`
	Email        string        `json:"email"     bson:"email"`
	UserName     string        `json:"username"  bson:"username"`
	PasswordHash string        `json:"-"         bson:"passwordHash"` // never serialised to JSON
	IsAdmin      bool          `json:"isAdmin"   bson:"isAdmin"`
	CreatedAt    time.Time     `json:"createdAt" bson:"createdAt"`
	UpdatedAt    time.Time     `json:"updatedAt" bson:"updatedAt"`
}

// RegisterRequest is the payload the client sends to POST /api/v1/auth/register
type RegisterRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	UserName string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required,min=8,max=25"`
}

// LoginRequest is the payload the client sends to POST /api/v1/auth/login
type LoginRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// UserPublic is what we return to the client after registration — no password hash, no internal fields.
type UserPublic struct {
	ID        bson.ObjectID `json:"id"`
	Email     string        `json:"email"`
	UserName  string        `json:"username"`
	IsAdmin   bool          `json:"isAdmin"`
	CreatedAt time.Time     `json:"createdAt"`
}
