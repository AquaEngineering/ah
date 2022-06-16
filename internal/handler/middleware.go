// Прослойка, которая парсит токен из запроса и предоставляет доступ для наших Энд-Поинтов

package handler

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

const (
	authorizationHeader = "Authorization"
	userCtx             = "userId"
)

// Реализуем следующую логику middleware

// Нам нужно получить значение из хедера авторизации, валидировать его,
// парсить токен и записать пользователя в контекст.
func (h *Handler) userIdentity_middleware(c *gin.Context) {

	// Получим хедер авторизации, валидируем его, что он не пустой.
	header := c.GetHeader(authorizationHeader)
	if header == "" {
		newErrorResponse(c, http.StatusUnauthorized, "empty auth header")
		return
	}

	// Вызовем функцию Split в которой укажем разделить нашу строку по пробелам
	headerParts := strings.Split(header, " ")
	// При корректном хедере эта функция должна вернуть массив длиной в 2 элемента
	if len(headerParts) != 2 || headerParts[0] != "Bearer" {
		// при ошибках возвращаем Status Code 401 - пользователь не авторизован
		newErrorResponse(c, http.StatusUnauthorized, "invalid auth header")
		return
	}

	// теперь нужно распарсить token
	if len(headerParts[1]) == 0 {
		newErrorResponse(c, http.StatusUnauthorized, "token is empty")
		return
	}

	// Метод ParseToken принимает token в качестве аргумента
	// и возвращать id пользователя при успешном парcинге
	userId, err := h.services.Authorization.ParseToken(headerParts[1])
	if err != nil {
		newErrorResponse(c, http.StatusUnauthorized, err.Error())
		return
	}

	// Если операция ParseToken успешна - запишем значение id в контекст.
	// Это мы делаем для того чтобы иметь доступ к id пользователям (которые делают запрос)
	// в последующих обработчиках, которые вызываются после данной прослойки.
	c.Set(userCtx, userId)
}

// Это middleware гарантирует, что запрос будет прерван с ошибкой
// если пользователь уже вошел в систему
func (h *Handler) ensureNotLoggedIn_middleware(c *gin.Context) {

	// c.Set("is_logged_in", true) // Этот флаг устанавливает, вошел ли пользователь в систему или нет
	// c.Set("is_logged_in", false) // Этот флаг устанавливает, вошел ли пользователь в систему или нет

	// func (h *Handler) userIdentity_middleware(c *gin.Context)
	{
		// Получим хедер авторизации, валидируем его, что он не пустой.
		header := c.GetHeader(authorizationHeader)
		if header == "" {
			// newErrorResponse(c, http.StatusUnauthorized, "empty auth header")
			return
		}

		// Вызовем функцию Split в которой укажем разделить нашу строку по пробелам
		headerParts := strings.Split(header, " ")
		// При корректном хедере эта функция должна вернуть массив длиной в 2 элемента
		if len(headerParts) != 2 || headerParts[0] != "Bearer" {
			// // при ошибках возвращаем Status Code 401 - пользователь не авторизован
			// newErrorResponse(c, http.StatusUnauthorized, "invalid auth header")
			return
		}

		// теперь нужно распарсить token
		if len(headerParts[1]) == 0 {
			// newErrorResponse(c, http.StatusUnauthorized, "token is empty")
			return
		}

		// Метод ParseToken принимает token в качестве аргумента
		// и возвращать id пользователя при успешном парcинге
		userId, err := h.services.Authorization.ParseToken(headerParts[1])
		if err != nil {
			// newErrorResponse(c, http.StatusUnauthorized, err.Error())
			return
		}

		// Если операция ParseToken успешна - запишем значение id в контекст.
		// Это мы делаем для того чтобы иметь доступ к id пользователям (которые делают запрос)
		// в последующих обработчиках, которые вызываются после данной прослойки.
		c.Set(userCtx, userId)

	}

	// Если ошибки нет или токен не пустой - пользователь уже авторизован
	// loggedIn := false
	// if loggedInInterface, ok := c.Get("is_logged_in"); ok {
	// 	loggedIn = loggedInInterface.(bool)
	// }

	// if token, err := c.Cookie("token"); err == nil || token != "" {
	c.AbortWithStatus(http.StatusUnauthorized)

	return
}

// Функция, достающая ID пользователя из контекста, обрабатывает ошибки и выводит response.
func getUserId_middleware(c *gin.Context) (int, error) {
	id, ok := c.Get(userCtx)
	if !ok {
		return 0, errors.New("user id not found")
	}

	idInt, ok := id.(int)
	if !ok {
		return 0, errors.New("user id is of invalid type")
	}

	return idInt, nil
}

//===========================================================================================================
//===========================================================================================================
//===========================================================================================================

// This middleware ensures that a request will be aborted with an error
// if the user is not logged in
func ensureLoggedIn() gin.HandlerFunc {
	return func(c *gin.Context) {
		// If there's an error or if the token is empty
		// the user is not logged in
		loggedIn := true
		if loggedInInterface, ok := c.Get("is_logged_in"); ok {
			loggedIn = loggedInInterface.(bool)
		}

		if !loggedIn {
			//if token, err := c.Cookie("token"); err != nil || token == "" {
			c.AbortWithStatus(http.StatusUnauthorized)
		}
	}
}

// Это middleware гарантирует, что запрос будет прерван с ошибкой
// если пользователь не вошел в систему
func (h *Handler) ensureLoggedIn_middleware(c *gin.Context) {

	// func (h *Handler) userIdentity_middleware(c *gin.Context)
	{
		// Получим хедер авторизации, валидируем его, что он не пустой.
		token, err := c.Cookie("token")
		if err != nil || token == "" {
			// newErrorResponse(c, http.StatusUnauthorized, "empty auth token")
			logout(c)
			return
		}

		// // Вызовем функцию Split в которой укажем разделить нашу строку по пробелам
		// headerParts := strings.Split(token, " ")
		// // При корректном хедере эта функция должна вернуть массив длиной в 2 элемента
		// if len(headerParts) != 2 || headerParts[0] != "Bearer" {
		// 	// при ошибках возвращаем Status Code 401 - пользователь не авторизован
		// 	newErrorResponse(c, http.StatusUnauthorized, "invalid auth token")
		// 	return
		// }

		// // теперь нужно распарсить token
		// if len(headerParts[1]) == 0 {
		// 	newErrorResponse(c, http.StatusUnauthorized, "token is empty")
		// 	return
		// }

		// Метод ParseToken принимает token в качестве аргумента
		// и возвращать id пользователя при успешном парcинге
		userId, err := h.services.Authorization.ParseToken(token) // headerParts[1])
		if err != nil {
			newErrorResponse(c, http.StatusUnauthorized, err.Error())
			logout(c)
			return
		}

		// Если операция ParseToken успешна - запишем значение id в контекст.
		// Это мы делаем для того чтобы иметь доступ к id пользователям (которые делают запрос)
		// в последующих обработчиках, которые вызываются после данной прослойки.
		c.Set(userCtx, userId)

	}

	// Если ошибки нет или токен не пустой - пользователь уже авторизован
	// loggedIn := false
	// if loggedInInterface, ok := c.Get("is_logged_in"); ok {
	// 	loggedIn = loggedInInterface.(bool)
	// }

	// if token, err := c.Cookie("token"); err == nil || token != "" {
	// c.AbortWithStatus(http.StatusUnauthorized)

	c.Set("is_logged_in", true) // Этот флаг устанавливает, вошел ли пользователь в систему или нет
	return
}

// This middleware ensures that a request will be aborted with an error
// if the user is already logged in
func ensureNotLoggedIn() gin.HandlerFunc {
	return func(c *gin.Context) {
		// If there's no error or if the token is not empty
		// the user is already logged in
		// loggedInInterface, _ := c.Get("is_logged_in")
		// loggedIn := loggedInInterface.(bool)
		loggedIn := false
		if loggedInInterface, ok := c.Get("is_logged_in"); ok {
			loggedIn = loggedInInterface.(bool)
		}

		if loggedIn {
			// if token, err := c.Cookie("token"); err == nil || token != "" {
			c.AbortWithStatus(http.StatusUnauthorized)
		}
	}
}

// This middleware sets whether the user is logged in or not
func setUserStatus() gin.HandlerFunc {
	return func(c *gin.Context) {
		if token, err := c.Cookie("token"); err == nil || token != "" {
			c.Set("is_logged_in", true)
		} else {
			c.Set("is_logged_in", false)
		}
	}
}
