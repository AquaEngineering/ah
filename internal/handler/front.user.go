// handlers.user.go

package handler

import (
	"math/rand"
	"net/http"
	"strconv"

	todo "github.com/AquaEngineering/AquaHub/internal/entities"

	"github.com/gin-gonic/gin"
)

func showLoginPage(c *gin.Context) {
	// Call the render function with the name of the template to render
	render(c, gin.H{
		"title": "Login",
	}, "login.html")
}

func performLogin(c *gin.Context) {

	// В структуру input будем записывать принятый json от пользователя
	var input todo.User

	// Obtain the POSTed login and password values
	input.Login = c.PostForm("login")       // login
	input.Password = c.PostForm("password") // password

	// var sameSiteCookie http.SameSite;

	// Check if the login/password combination is valid
	if isUserValid(input.Login, input.Password) {
		// If the login/password is valid set the token in a cookie
		token := generateSessionToken()
		// c.SetCookie("token", token, 3600, "", "", sameSiteCookie, false, true)
		c.SetCookie("token", token, 3600, "", "", false, true)
		c.Set("is_logged_in", true)

		render(c, gin.H{
			"title": "Successful Login"}, "login-successful.html")

	} else {
		// If the login/password combination is invalid,
		// show the error message on the login page
		c.HTML(http.StatusBadRequest, "login.html", gin.H{
			"ErrorTitle":   "Login Failed",
			"ErrorMessage": "Invalid credentials provided"})
	}
}

func (h *Handler) frontPerformLogin(c *gin.Context) {

	// В структуру input будем записывать принятый json от пользователя
	var input todo.User

	// Obtain the POSTed login and password values
	input.Login = c.PostForm("login")       // Login
	input.Password = c.PostForm("password") // password

	// If the login/password is valid set the token in a cookie
	token, err := h.services.Authorization.GenerateToken(input.Login, input.Password)
	if err != nil {

		c.HTML(http.StatusInternalServerError, "login.html", gin.H{
			"ErrorTitle":   "Sing In Failed",
			"ErrorMessage": err.Error()}) // "Invalid credentials provided"

		// // Возвращаем ошибку SQL из БД
		// newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.SetCookie("token", token, 3600, "", "", false, true)
	c.Set("is_logged_in", true)

	// Redirect to page
	c.Redirect(http.StatusFound, "/hw/aquahubs")
}

func generateSessionToken() string {
	// We're using a random 16 character string as the session token
	// This is NOT a secure way of generating session tokens
	// DO NOT USE THIS IN PRODUCTION
	return strconv.FormatInt(rand.Int63(), 16)
}

func logout(c *gin.Context) {

	// var sameSiteCookie http.SameSite;

	// Clear the cookie
	// c.SetCookie("token", "", -1, "", "", sameSiteCookie, false, true)
	c.SetCookie("token", "", -1, "", "", false, true)

	// Redirect to the home page
	c.Redirect(http.StatusTemporaryRedirect, "/")
}

func showRegistrationPage(c *gin.Context) {
	// Call the render function with the name of the template to render
	render(c, gin.H{
		"title": "Register"}, "register.html")
}

func register(c *gin.Context) {
	// Obtain the POSTed login and password values
	login := c.PostForm("login")
	password := c.PostForm("password")

	// var sameSiteCookie http.SameSite;

	if _, err := registerNewUser(login, password); err == nil {
		// If the user is created, set the token in a cookie and log the user in
		token := generateSessionToken()
		// c.SetCookie("token", token, 3600, "", "", sameSiteCookie, false, true)
		c.SetCookie("token", token, 3600, "", "", false, true)
		c.Set("is_logged_in", true)

		render(c, gin.H{
			"title": "Successful registration & Login"}, "login-successful.html")

	} else {
		// If the login/password combination is invalid,
		// show the error message on the login page
		c.HTML(http.StatusBadRequest, "register.html", gin.H{
			"ErrorTitle":   "Registration Failed",
			"ErrorMessage": err.Error()})

	}
}

func (h *Handler) frontPerformRegister(c *gin.Context) {

	// В структуру input будем записывать принятый json от пользователя
	var input todo.User

	// Obtain the POSTed login and password values
	input.Name = c.PostForm("name")
	input.Login = c.PostForm("login")
	input.Password = c.PostForm("password")
	input.Token = c.PostForm("token")

	if input.Name == "" || input.Login == "" || input.Password == "" || input.Token == "" {

		// logrus.Debugf("Register empty values: %s, %s, %s, %s", input.Name, input.Login, input.Password, input.Token)

		// If the login/password combination is invalid,
		// show the error message on the login page
		c.HTML(http.StatusInternalServerError, "register.html", gin.H{
			"ErrorTitle":   "Sing Up Failed",
			"ErrorMessage": "There should be no empty values"})
		return
	}

	if input.Password != c.PostForm("password2") {
		// If the login/password combination is invalid,
		// show the error message on the login page
		c.HTML(http.StatusInternalServerError, "register.html", gin.H{
			"ErrorTitle":   "Sing Up Failed",
			"ErrorMessage": "Confirm password invalid"})
		return
	}

	// Далеее передаём данные на другой слой - В бизнес логику

	// Принимает структуру User в качестве аргумента
	// Возвращает ID созданного нового пользователя из БД
	// Или 500 - внутренняя ошибка на сервере
	// id, err := h.services.Authorization.CreateUser(input)
	_, err := h.services.Authorization.CreateUser(input)
	if err == nil {

		// If the login/password is valid set the token in a cookie
		token, err := h.services.Authorization.GenerateToken(input.Login, input.Password)
		if err != nil {

			// If the login/password combination is invalid,
			// show the error message on the login page
			c.HTML(http.StatusInternalServerError, "register.html", gin.H{
				"ErrorTitle":   "Sing Up Failed",
				"ErrorMessage": err.Error()})

			// // Возвращаем ошибку SQL из БД
			// newErrorResponse(c, http.StatusInternalServerError, err.Error())
			return
		}

		c.SetCookie("token", token, 3600, "", "", false, true)
		c.Set("is_logged_in", true)

		render(c, gin.H{
			"title": "Successful registration & Login"}, "login-successful.html")

	} else {

		// If the login/password combination is invalid,
		// show the error message on the login page
		c.HTML(http.StatusBadRequest, "register.html", gin.H{
			"ErrorTitle":   "Sing Up Failed",
			"ErrorMessage": err.Error()})
		return
	}
}
