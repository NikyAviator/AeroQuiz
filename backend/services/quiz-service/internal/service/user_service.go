// Package service contains the business logic for user management in the quiz-service.
// It sits between the controllers (HTTP) and the repository (DB).
// This is where we enforce rules: unique emails, password hashing, admin privileges.
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

// UserService is the interface the controller depends on.
// Depending on the interface (not the concrete struct) keeps layers decoupled.
type UserService interface {
	RegisterUser(ctx context.Context, req domain.RegisterRequest) (domain.UserPublic, error)
	// LoginUser returns the signed JWT token AND the public user — the controller
	// sets the token as a cookie and returns the user info in the response body.
	LoginUser(ctx context.Context, req domain.LoginRequest) (token string, user domain.UserPublic, err error)
	// GetMe fetches the public user from DB using the userId stashed in the
	// JWT claims by the Authn middleware. Powers GET /api/v1/me.
	GetMe(ctx context.Context, userID string) (domain.UserPublic, error)
}

// userService is the concrete implementation — unexported intentionally.
type userService struct {
	repo       repository.UserRepository
	adminEmail string // email that always receives IsAdmin: true
}

// NewUserService constructs a userService with its dependencies injected.
func NewUserService(repo repository.UserRepository, adminEmail string) UserService {
	return &userService{
		repo:       repo,
		adminEmail: strings.ToLower(strings.TrimSpace(adminEmail)),
	}
}

// RegisterUser validates the request, checks for duplicate email,
// hashes the password, and persists the new user.
func (s *userService) RegisterUser(ctx context.Context, req domain.RegisterRequest) (domain.UserPublic, error) {
	email := strings.ToLower(strings.TrimSpace(req.Email))

	// 1. Check for duplicate email
	existing, err := s.repo.FindByEmail(ctx, email)
	if err != nil {
		return domain.UserPublic{}, err
	}
	if existing != nil {
		return domain.UserPublic{}, errors.New("email already registered")
	}

	// 2. Hash the password — never store plaintext
	hash, err := utils.HashPassword(req.Password)
	if err != nil {
		return domain.UserPublic{}, err
	}

	// 3. Build the user document
	now := time.Now().UTC()
	user := &domain.User{
		ID:           bson.NewObjectID(),
		Email:        email,
		UserName:     strings.TrimSpace(req.UserName),
		PasswordHash: hash,
		IsAdmin:      email == s.adminEmail,
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	// 4. Persist
	if err := s.repo.Create(ctx, user); err != nil {
		return domain.UserPublic{}, err
	}

	return domain.UserPublic{
		ID:        user.ID,
		Email:     user.Email,
		UserName:  user.UserName,
		IsAdmin:   user.IsAdmin,
		CreatedAt: user.CreatedAt,
	}, nil
}

// LoginUser verifies credentials, issues a signed JWT, and returns both
// the token (for the controller to set as a cookie) and the public user
// info (for the controller to return in the response body).
func (s *userService) LoginUser(ctx context.Context, req domain.LoginRequest) (string, domain.UserPublic, error) {
	email := strings.ToLower(strings.TrimSpace(req.Email))

	// ValidateCredentials now returns the full user so we can build UserPublic
	user, err := s.repo.ValidateCredentials(ctx, email, req.Password)
	if err != nil {
		return "", domain.UserPublic{}, errors.New("invalid email or password")
	}

	token, err := utils.GenerateToken(user.Email, user.ID.Hex())
	if err != nil {
		return "", domain.UserPublic{}, err
	}

	return token, domain.UserPublic{
		ID:        user.ID,
		Email:     user.Email,
		UserName:  user.UserName,
		IsAdmin:   user.IsAdmin,
		CreatedAt: user.CreatedAt,
	}, nil
}

// GetMe converts the raw userId string from the JWT claims into a bson.ObjectID,
// fetches the user from the DB, and returns UserPublic.
// The Authn middleware already verified the JWT before this is called.
func (s *userService) GetMe(ctx context.Context, userID string) (domain.UserPublic, error) {
	// Convert the hex string from the JWT claim to a bson.ObjectID
	oid, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		return domain.UserPublic{}, errors.New("invalid user id")
	}

	user, err := s.repo.FindByID(ctx, oid)
	if err != nil {
		return domain.UserPublic{}, err
	}
	if user == nil {
		return domain.UserPublic{}, errors.New("user not found")
	}

	return domain.UserPublic{
		ID:        user.ID,
		Email:     user.Email,
		UserName:  user.UserName,
		IsAdmin:   user.IsAdmin,
		CreatedAt: user.CreatedAt,
	}, nil
}
