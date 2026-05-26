package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type User struct {
	ID           bson.ObjectID `json:"id" bson:"_id,omitempty"`
	Email        string        `json:"email" bson:"email" binding:"required"`
	UserName     string        `json:"username" bson:"username" binding:"required"`
	PasswordHash string        `json:"-" bson:"passwordHash" binding:"required"`
	CreatedAt    time.Time     `json:"createdAt" bson:"createdAt"`
	UpdatedAt    time.Time     `json:"updatedAt" bson:"updatedAt"`
}

type LoginRequest struct {
	Email    string        `json:"email"`
	UserName string        `json:"username"`
	Password string        `json:"password"` // Password should match the password hash of the user trying to log in
	UserId   bson.ObjectID `json:"userId"`   // Authentication purpose, should match the ID of the user trying to log in
}
