// handlers.article.go

package handler

import (
	"errors"
	"net/http"
	"strconv"

	todo "github.com/AquaEngineering/AquaHub/internal/entities"

	"github.com/gin-gonic/gin"
)

type article struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

// Для этой демонстрации мы сохраняем список статей в памяти
// В реальном приложении этот список, скорее всего, будет выбран
// из базы данных или из статических файлов
var articleList = []article{
	{ID: 1, Title: "Article 1", Content: "Article 1 body"},
	{ID: 2, Title: "Article 2", Content: "Article 2 body"},
}

// Return a list of all the articles
func getAllArticles() []article {
	return articleList
}

// Fetch an article based on the ID supplied
func getArticleByID(id int) (*article, error) {
	for _, a := range articleList {
		if a.ID == id {
			return &a, nil
		}
	}
	return nil, errors.New("Article not found")
}

// Create a new article with the title and content provided
func createNewArticle(title, content string) (*article, error) {
	// Set the ID of a new article to one more than the number of articles
	a := article{ID: len(articleList) + 1, Title: title, Content: content}

	// Add the article to the list of articles
	articleList = append(articleList, a)

	return &a, nil
}

// ==================================================================================================
//
//
func (h *Handler) showIndexPage(c *gin.Context) {

	if token, err := c.Cookie("token"); err == nil || token != "" {

		_, err := h.services.Authorization.ParseToken(token) // userId
		if err == nil {
			c.Set("is_logged_in", true)
		}
	}

	lists, err := h.services.TodoList.GetAllTodo()
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	// Call the render function with the name of the template to render
	render(c, gin.H{
		"title":   "Home Page",
		"payload": lists}, "index.html")

	/*
		articles := getAllArticles()

		// Call the render function with the name of the template to render
		render(c, gin.H{
			"title":   "Home Page",
			"payload": articles}, "index.html")
	*/
}

//__________________________________________________________________________________________________________

func showArticleCreationPage(c *gin.Context) {
	// Call the render function with the name of the template to render
	render(c, gin.H{
		"title": "Create New Article"}, "create-article.html")
}

//__________________________________________________________________________________________________________
//__________________________________________________________________________________________________________

func getArticle(c *gin.Context) {
	// Check if the article ID is valid
	if articleID, err := strconv.Atoi(c.Param("article_id")); err == nil {
		// Check if the article exists
		if article, err := getArticleByID(articleID); err == nil {
			// Call the render function with the title, article and the name of the
			// template
			render(c, gin.H{
				"title":   article.Title,
				"payload": article}, "article.html")

		} else {
			// If the article is not found, abort with an error
			c.AbortWithError(http.StatusNotFound, err)
		}

	} else {
		// If an invalid article ID is specified in the URL, abort with an error
		c.AbortWithStatus(http.StatusNotFound)
	}
}

func (h *Handler) getArticleById(c *gin.Context) {

	// Реализуем логику получения списка по id.

	userId, err := getUserId_middleware(c)
	if err != nil {
		// If the article is not found, abort with an error
		c.AbortWithError(http.StatusNotFound, err)

		// newErrorResponse(c, http.StatusInternalServerError, err.Error())
		// return
	}

	// Вызовем у контекста метод Param, указав в качестве аргумента имя параметра.
	// И обернем эту функцию в Atoi, из стандартной библиотеки strconv, для преобразования строки в число.
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		// If the article is not found, abort with an error
		c.AbortWithError(http.StatusNotFound, err)

		// newErrorResponse(c, http.StatusBadRequest, "invalid id param")
		// return
	}

	list, err := h.services.TodoList.GetById(userId, id)
	if err != nil {
		// If an invalid article ID is specified in the URL, abort with an error
		c.AbortWithStatus(http.StatusNotFound)

		// newErrorResponse(c, http.StatusInternalServerError, err.Error())
		// return
	}

	// Call the render function with the title, article and the name of the
	// template
	render(c, gin.H{
		"title":   "article.Title",
		"payload": list}, "article.html")

	// c.JSON(http.StatusOK, list)
}

//__________________________________________________________________________________________________________

func createArticle(c *gin.Context) {
	// Obtain the POSTed title and content values
	title := c.PostForm("title")
	content := c.PostForm("content")

	if a, err := createNewArticle(title, content); err == nil {
		// If the article is created successfully, show success message
		render(c, gin.H{
			"title":   "Submission Successful",
			"payload": a}, "submission-successful.html")
	} else {
		// if there was an error while creating the article, abort with an error
		c.AbortWithStatus(http.StatusBadRequest)
	}
}

func (h *Handler) createArticleForUser(c *gin.Context) {

	// Получение ID пользователя из контекста и последующий его вывод в response
	userId, err := getUserId_middleware(c)
	if err != nil {
		// добавим обработку случая когда в контексте нет id пользователя
		// if there was an error while creating the article, abort with an error
		c.AbortWithStatus(http.StatusBadRequest)

		// newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	// Obtain the POSTed title and content values
	var input todo.TodoList
	input.Title = c.PostForm("title")         // title
	input.Description = c.PostForm("content") // content

	// if err := c.BindJSON(&input); err != nil {
	// 	newErrorResponse(c, http.StatusBadRequest, err.Error())
	// 	return
	// }

	// Вызовем метод создания списка,
	// в который передадим наши данные, полученные из токена аутентификации и тела запроса.
	// id, err := h.services.TodoList.Create(userId, input)
	id, err := h.services.TodoList.Create(userId, input)
	if err != nil {
		// if there was an error while creating the article, abort with an error
		c.AbortWithStatus(http.StatusBadRequest)

		// newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	// Добавим тело ответа при успешном запросе, в котором будем возвращать ID созданного списка.
	a := article{ID: id, Title: input.Title, Content: input.Description}
	render(c, gin.H{
		"title":   "Submission Successful",
		"payload": a}, "submission-successful.html")

	// c.JSON(http.StatusOK, map[string]interface{}{
	// 	"id": id,
	// })
}

//__________________________________________________________________________________________________________
