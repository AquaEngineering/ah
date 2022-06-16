package service

import (
	"crypto/sha1"
	"errors"
	"fmt"
	"time"

	entities "github.com/AquaEngineering/AquaHub/internal/entities"
	"github.com/AquaEngineering/AquaHub/internal/repository"
	"github.com/dgrijalva/jwt-go"
)

const (
	salt       = "hjqrhjqw124617ajfhajs" // Случайные символы для генерации хеша пароля
	signingKey = "qrkjk#4#%35FSFJlja#4353KSFjH"
	tokenTTL   = 12 * time.Hour
)

// Структура со стандартным Claims и с добавленным полем id пользователя
// Где будет сохранятся всё о токене
type tokenClaims struct {
	jwt.StandardClaims
	UserId int `json:"user_id"`
}

type AuthService struct {
	repo repository.Authorization
}

func NewAuthService(repo repository.Authorization) *AuthService {
	return &AuthService{repo: repo}
}

// Генерация хеша пароля
func generatePasswordHash(password string) string {
	hash := sha1.New()
	hash.Write([]byte(password))

	// Случайные символы для генерации хеша пароля
	return fmt.Sprintf("%x", hash.Sum([]byte(salt)))
}

// Принимает структуру User в качестве аргумента
// Возвращает ID созданного нового пользователя из БД
func (s *AuthService) CreateUser(user entities.User) (int, error) {
	user.Password = generatePasswordHash(user.Password) // Генерация хеша пароля
	return s.repo.CreateUser(user)
}

// Запросить токен пользователя
func (s *AuthService) GenerateToken(username, password string) (string, error) {

	// Запросить в БД id пользователя
	user, err := s.repo.GetUser_LoginPassword(username, generatePasswordHash(password))
	if err != nil {
		return "", err
	}

	// Генерируем токен из Стандартной подписи и Claims
	// Claims - JSON объект с набором полей
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &tokenClaims{
		jwt.StandardClaims{
			// ExpiresAt = на 12 часов болше текущего времени
			// т.е. токен перестанет быть валидным через 12 часов
			ExpiresAt: time.Now().Add(tokenTTL).Unix(),
			// Время генерации токена
			IssuedAt: time.Now().Unix(),
		},
		user.Id,
	})

	// Подпишем и вернём токен с ключём подписи signingKey. Для расшифровки он же.
	return token.SignedString([]byte(signingKey))
}

// Метод ParseToken принимает token в качестве аргумента
// и возвращает id пользователя при успешном парcинге
func (s *AuthService) ParseToken(accessToken string) (int, error) {

	// Вызываем функцию ParseWithClaims из библиотеки jwt, которая принимает:
	//   - token,
	//   - структуру Claims,
	//   - функцию которая возвращает ключ подписи или ошибку
	// В этой функции нам нужно проверить метод подписи токена.
	// Если это не HMAC то мы возвращаем ошибку
	// А если всё О'кей то ключ подписи
	token, err := jwt.ParseWithClaims(accessToken, &tokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}

		return []byte(signingKey), nil
	})

	if err != nil {
		return 0, err
	}

	// Функция ParseWithClaims возвращает объект token в котором есть поле Claims типа интерфейс
	// Приведём его к нашей структуре и проверим всё ли хорошо
	claims, ok := token.Claims.(*tokenClaims)
	if !ok {
		return 0, errors.New("token claims are not of type *tokenClaims")
	}

	// Возвращаем id пользователя при успешном парcинге token
	return claims.UserId, nil
}

// Запросить по токенам из БД id_шки пользователя, аквахаба, устройств и сенсоров
func (s *AuthService) GetUserHWfromTokens(h_token, u_token string) ([]entities.SensorDataSet, error) { // user_id, aquahub_id, []{device_id, sensor_id}

	// Запросить по токенам из БД id_шки пользователя, аквахаба, устройств и сенсоров
	lists, err := s.repo.GetUserHW_fromTokens(h_token, u_token)
	return lists, err
}

// Запросить по токенам из БД id_шки пользователя, аквахаба, устройств и сенсоров
func (s *AuthService) GetAquahubIdfromTokens(h_token, u_token string) (int, error) { // user_id, aquahub_id, []{device_id, sensor_id}

	// Запросить по токенам из БД id_шки пользователя, аквахаба, устройств и сенсоров
	aId, err := s.repo.GetAquahubId_fromTokens(h_token, u_token)
	return aId, err
}
