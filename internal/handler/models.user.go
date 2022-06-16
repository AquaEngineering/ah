// models.user.go

package handler

import (
	"errors"
	"strings"
)

type user struct {
	Username string `json:"username"`
	Password string `json:"-"`
	Key      string `json:"-"`
}

// For this demo, we're storing the user list in memory
// We also have some users predefined.
// In a real application, this list will most likely be fetched
// from a database. Moreover, in production settings, you should
// store passwords securely by salting and hashing them instead
// of using them as we're doing in this demo

// Для этой демонстрации мы сохраняем список пользователей в памяти
// У нас также есть предопределенные пользователи.
// В реальном приложении этот список, скорее всего, будет выбран
// из базы данных. Более того, в производственных настройках следует
// безопасно хранить пароли, вместо этого добавляя соль и хешируя их
// использовать их, как мы делаем в этой демонстрации
var userList = []user{
	{Username: "user1", Password: "pass1", Key: "1"},
	{Username: "user2", Password: "pass2", Key: "2"},
	{Username: "user3", Password: "pass3", Key: "3"},
}

// Check if the username and password combination is valid
func isUserValid(username, password string) bool {
	for _, u := range userList {
		if u.Username == username && u.Password == password {
			return true
		}
	}
	return false
}

// Register a new user with the given username and password
// NOTE: For this demo, we

// Зарегистрировать нового пользователя с заданным именем, паролем и ключем
// ПРИМЕЧАНИЕ. Для этой демонстрации мы
func registerNewUser(username, password string) (*user, error) {
	if strings.TrimSpace(password) == "" {
		return nil, errors.New("The password can't be empty")
	} else if !isUsernameAvailable(username) {
		return nil, errors.New("The username isn't available")
	}

	u := user{Username: username, Password: password, Key: ""}

	userList = append(userList, u)

	return &u, nil
}

// Check if the supplied username is available

// Проверяем, доступно ли указанное имя пользователя
func isUsernameAvailable(username string) bool {
	for _, u := range userList {
		if u.Username == username {
			return false
		}
	}
	return true
}

// Проверяем, доступен ли ключ пользователя
func isUserKeyAvailable(key string) bool {
	for _, u := range userList {
		if u.Key == key {
			return true
		}
	}
	return false
}
