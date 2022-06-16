package handler

import (
	"net/http"

	todo "github.com/AquaEngineering/AquaHub/internal/entities"

	"github.com/gin-gonic/gin"
)

// Обработчик регистрации

// @Summary SignUp
// @Tags auth
// @Description create account
// @ID create-account
// @Accept  json
// @Produce  json
// @Param input body todo.User true "account info"
// @Success 200 {integer} integer 1
// @Failure 400,404 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Failure default {object} errorResponse
// @Router /auth/sign-up [post]
func (h *Handler) signUp(c *gin.Context) {

	// В структуру input будем записывать принятый json от пользователя
	var input todo.User

	// У gin.Context есть метод BindJSON, принимающий ссылку на структуру
	// в которую кладёт распарсенный и предварительно валидированный принятый json
	// Или 400 - ошибка на стороне клиента
	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, "User send invalid input body") // http.StatusBadRequest = 400
		return
	}

	// Далеее передаём данные на другой слой - В бизнес логику

	// Принимает структуру User в качестве аргумента
	// Возвращает ID созданного нового пользователя из БД
	// Или 500 - внутренняя ошибка на сервере
	id, err := h.services.Authorization.CreateUser(input)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error()) // http.StatusInternalServerError = 500
		return
	}

	// Если выше всё Ок:
	// Записываем в ответный JSON статус http.StatusOK = 200 и id созданного пользователя
	c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
	})
}

type signInInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Обработчик аутентификации

// @Summary SignIn
// @Tags auth
// @Description login
// @ID login
// @Accept  json
// @Produce  json
// @Param input body signInInput true "credentials"
// @Success 200 {string} string "token"
// @Failure 400,404 {object} errorResponse
// @Failure 500 {object} errorResponse
// @Failure default {object} errorResponse
// @Router /auth/sign-in [post]
func (h *Handler) signIn(c *gin.Context) {
	var input signInInput

	if err := c.BindJSON(&input); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	token, err := h.services.Authorization.GenerateToken(input.Username, input.Password)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		// Возвращаем ошибку SQL из БД
		return
	}

	// Если пользователь существует, то в ответе получаем токен.
	c.JSON(http.StatusOK, map[string]interface{}{
		"token": token,
	})
}
