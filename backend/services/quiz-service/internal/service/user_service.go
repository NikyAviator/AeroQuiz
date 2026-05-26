// Package service contains the business logic for user management in the quiz-service. It defines the UserService struct and its methods for registering and logging in users.
// The service interacts with the repository layer to perform database operations and uses utility functions for password hashing and token generation.
// This is where we enforce rules like unique emails, password security, and admin privileges based on email.
package service

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/domain"
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/repository"
	"github.com/NikyAviator/AeroQuiz/backend/shared/utils"
	"go.mongodb.org/mongo-driver/v2/bson"
)

// UserService handles all user-related business logic.
type UserService struct {
	repo       repository.UserRepository
	adminEmail string // loaded from env — this address always gets IsAdmin: true
}

// NewUserService constructs a UserService with its dependencies injected.
func NewUserService(repo repository.UserRepository, adminEmail string) *UserService {
	return &UserService{
		repo:       repo,
		adminEmail: strings.ToLower(strings.TrimSpace(adminEmail)),
	}
}

// RegisterUser validates the request, hashes the password, flags admin if
// the email matches, and persists the new user. All DB work runs in the
// context passed in by the caller (usually a per-request context).
func (s *UserService) RegisterUser(ctx context.Context, req domain.RegisterRequest) (*domain.User, error) {
	// 1. Normalise the incoming email for consistent comparison
	email := strings.ToLower(strings.TrimSpace(req.Email))

	// 2. Check whether the email is already taken
	existing, err := s.repo.FindByEmail(ctx, email)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("email already registered")
	}

	// 3. Hash the password — never store plaintext
	hash, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	// 4. Build the user document
	now := time.Now().UTC()
	user := &domain.User{
		ID:           bson.NewObjectID(),
		Email:        email,
		UserName:     strings.TrimSpace(req.UserName),
		PasswordHash: hash,
		IsAdmin:      email == s.adminEmail, // grant admin if email matches env var
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	// 5. Persist — repo handles the actual MongoDB insert
	if err := s.repo.CreateUser(ctx, user); err != nil {
		return nil, err
	}

	return user, nil
}

// LoginUser verifies credentials and returns a signed JWT on success.
func (s *UserService) LoginUser(ctx context.Context, req domain.LoginRequest) (string, error) {
	email := strings.ToLower(strings.TrimSpace(req.Email))

	user, err := s.repo.FindByEmail(ctx, email)
	if err != nil {
		return "", err
	}
	if user == nil {
		return "", errors.New("invalid credentials")
	}

	if !utils.CheckPasswordHash(req.Password, user.PasswordHash) {
		return "", errors.New("invalid credentials")
	}

	token, err := utils.GenerateToken(user.Email, user.ID.Hex())
	if err != nil {
		return "", err
	}

	return token, nil
}
