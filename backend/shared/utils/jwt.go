package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/nikyaviator/AeroQuiz/backend/shared/env"
)

var secretKey = env.GetString("SECRET_KEY", "defaultsecretkey")

func GenerateToken(email, userId string) (string, error) {

	// starts at 0 for userId? when created?
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email":  email,
		"userId": userId,
		"exp":    time.Now().Add(time.Hour * 1).Unix(),
	})

	return token.SignedString([]byte(secretKey))
}

func VerifyToken(token string) (jwt.MapClaims, error) {
	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (any, error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return nil, jwt.ErrTokenMalformed
		}
		return []byte(secretKey), nil
	})
	if err != nil {
		return nil, errors.New("could not parse token")
	}

	tokenIsValid := parsedToken.Valid

	if !tokenIsValid {
		return nil, errors.New("invalid token")
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("invalid token claims")
	}
	// You can extract claims if needed
	// email := claims["email"].(string)
	// userId := claims["userId"].(string)

	return claims, nil

}
