// Package service contains the business logic for user management in the quiz-service.
package service

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/domain"
	"github.com/NikyAviator/AeroQuiz/backend/services/quiz-service/internal/repository"
	"github.com/NikyAviator/AeroQuiz/backend/shared/utils"
)

type UserService interface {
	CreateUser(ctx context.Context, in domain.LoginRequest) (domain.UserPublic, error)
	LoginUser(ctx context.Context, loginReq domain.LoginRequest) (string, error)
}

type userService struct {
	userRepo repository.UserRepository
}

func NewUserService(r repository.UserRepository) UserService {
	return &userService{userRepo: r}
}

func (s *userService) CreateUser(ctx context.Context, userLoginReq domain.LoginRequest) (domain.UserPublic, error) {

	if strings.TrimSpace(userLoginReq.Email) == "" || strings.TrimSpace(userLoginReq.Password) == "" {
		return domain.UserPublic{}, errors.New("missing required fields")
	}

	// Hash the password before storing
	hashedPassword, err := utils.HashPassword(userLoginReq.Password)
	if err != nil {
		return domain.UserPublic{}, err
	}

	// Merge input into domain.User
	newUser := &domain.User{
		Email:        userLoginReq.Email,
		PasswordHash: hashedPassword,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	// Create user in the repository
	err = s.userRepo.Create(ctx, newUser)
	if err != nil {
		return domain.UserPublic{}, err
	}

	// Prepare public user data to return
	userPublic := domain.UserPublic{
		ID:        newUser.ID,
		Email:     newUser.Email,
		CreatedAt: newUser.CreatedAt,
	}

	return userPublic, nil

}

func (s *userService) LoginUser(ctx context.Context, loginReq domain.LoginRequest) (string, error) {
	if strings.TrimSpace(loginReq.Email) == "" || strings.TrimSpace(loginReq.Password) == "" {
		return "", errors.New("email and password are required")
	}

	// Validate credentials -> returns the DB user ID
	userID, err := s.userRepo.ValidateCredentials(ctx, loginReq.Email, loginReq.Password)
	if err != nil {
		return "", errors.New("invalid email or password")
	}

	// Issue JWT token
	// Keep email from the request for now; if you later want canonical case, return email from repo too.
	token, err := utils.GenerateToken(loginReq.Email, userID)
	if err != nil {
		return "", err
	}
	return token, nil
}
