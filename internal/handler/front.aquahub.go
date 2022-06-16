// handlers.article.go

package handler

import (
	"fmt"

	// "errors"
	"net/http"
	"strconv"

	// entities "github.com/AquaEngineering/AquaHub/internal/entities"

	"github.com/gin-gonic/gin"
)

/*
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


		// articles := getAllArticles()

		// // Call the render function with the name of the template to render
		// render(c, gin.H{
		// 	"title":   "Home Page",
		// 	"payload": articles}, "index.html")

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

*/

func (h *Handler) showPage_AquaHubs(c *gin.Context) {

	token, err := c.Cookie("token")
	if err != nil || token != "" {

	}

	userId, err := h.services.Authorization.ParseToken(token)
	if err != nil {

	}

	c.Set("is_logged_in", true)

	lists, err := h.services.AquahubList.GetAllAquahubOfUser(userId)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	// Call the render function with the name of the template to render
	render(c, gin.H{
		"title":   "AquaHub list",
		"payload": lists}, "aquahubs.html")
}

//__________________________________________________________________________________________________________

type AnaliticFields struct {
	Created_At string `json:"created_at"`
	Field1     string `json:"field1"`
}

type ChannelInfo struct {
	Name          string `json:"name"`
	Field1        string `json:"field1"`
	Last_entry_id string `json:"last_entry_id"`
}

type AnaliticJson struct {
	Channel ChannelInfo      `json:"channel"`
	Feeds   []AnaliticFields `json:"feeds"`
}

/*
"channel": {
	"name": "Aqua",
	"Field1": "Скорость вент. , %",
	"last_entry_id": 1
	},
"feeds": [
	{
			"Created_At": "2021-09-13T23:00:00+03:00",
			"Field1": "3.0"
	}]
}

*/

func (h *Handler) showPage_Analytics(c *gin.Context) {

	token, err := c.Cookie("token")
	if err != nil || token != "" {
		c.Set("is_logged_in", false)
	}

	// _, err := h.services.Authorization.ParseToken(token) //
	// if err != nil {
	// 	c.Set("is_logged_in", false)
	// }

	c.Set("is_logged_in", true)

	// lists, err := h.serices.AquahubList.GetAllAquahubOfUser(userId)
	// if err != nil {
	// 	newErrorResponse(c, http.StatusInternalServerError, err.Error())
	// 	return
	// }

	// Call the render function with the name of the template to render
	render(c, gin.H{
		"title": "Analytics",
		"SensorJSON": "/static/850851.json",}, "analytics.html")
}

//__________________________________________________________________________________________________________

func (h *Handler) showPage_Devices(c *gin.Context) {

	// Получим ID пользователя, чтоб проверить наличие АкваХаба у него
	// userId, err := getUserId_middleware(c)
	// if err != nil {
	// 	// If the article is not found, abort with an error
	// 	c.AbortWithError(http.StatusNotFound, err)

	// 	// newErrorResponse(c, http.StatusInternalServerError, err.Error())
	// 	// return
	// }

	// Реализуем логику получения списка по id.

	// Вызовем у контекста метод Param, указав в качестве аргумента имя параметра.
	// И обернем эту функцию в Atoi, из стандартной библиотеки strconv, для преобразования строки в число.
	aquahubId, err := strconv.Atoi(c.Param("aquahubId"))
	if err != nil {
		// If the article is not found, abort with an error
		c.AbortWithError(http.StatusNotFound, err)

		// newErrorResponse(c, http.StatusBadRequest, "invalid id param")
		// return
	}

	list, err := h.services.AquahubList.GetDevicesOfAquahub(aquahubId)
	if err != nil {
		// If an invalid article ID is specified in the URL, abort with an error
		c.AbortWithStatus(http.StatusNotFound)

		// newErrorResponse(c, http.StatusInternalServerError, err.Error())
		// return
	}

	// Call the render function with the title, article and the name of the
	// template
	render(c, gin.H{
		"title":   "Device list",
		"payload": list}, "devices.html")

	// c.JSON(http.StatusOK, list)
}

//__________________________________________________________________________________________________________

func (h *Handler) showPage_Sensors(c *gin.Context) {

	// Получим ID пользователя, чтоб проверить наличие АкваХаба у него
	// userId, err := getUserId_middleware(c)
	// if err != nil {
	// 	// If the article is not found, abort with an error
	// 	c.AbortWithError(http.StatusNotFound, err)

	// 	// newErrorResponse(c, http.StatusInternalServerError, err.Error())
	// 	// return
	// }

	// Реализуем логику получения списка по id.

	// Вызовем у контекста метод Param, указав в качестве аргумента имя параметра.
	// И обернем эту функцию в Atoi, из стандартной библиотеки strconv, для преобразования строки в число.
	deviceId, err := strconv.Atoi(c.Param("deviceId"))
	if err != nil {
		// If the article is not found, abort with an error
		c.AbortWithError(http.StatusNotFound, err)

		// newErrorResponse(c, http.StatusBadRequest, "invalid id param")
		// return
	}

	list, err := h.services.AquahubList.GetSensorsOfDevice(deviceId)
	if err != nil {
		// If an invalid article ID is specified in the URL, abort with an error
		c.AbortWithStatus(http.StatusNotFound)

		// newErrorResponse(c, http.StatusInternalServerError, err.Error())
		// return
	}

	// Call the render function with the title, article and the name of the
	// template
	render(c, gin.H{
		"title":   "Sensor list",
		"payload": list}, "sensors.html")

	// c.JSON(http.StatusOK, list)
}

//__________________________________________________________________________________________________________

func (h *Handler) showPage_SensorDataSet(c *gin.Context) {

	// Получим ID пользователя, чтоб проверить наличие АкваХаба у него
	// userId, err := getUserId_middleware(c)
	// if err != nil {
	// 	// If the article is not found, abort with an error
	// 	c.AbortWithError(http.StatusNotFound, err)

	// 	// newErrorResponse(c, http.StatusInternalServerError, err.Error())
	// 	// return
	// }

	// Реализуем логику получения списка по id.

	// Вызовем у контекста метод Param, указав в качестве аргумента имя параметра.
	// И обернем эту функцию в Atoi, из стандартной библиотеки strconv, для преобразования строки в число.
	sensorId, err := strconv.Atoi(c.Param("sensorId"))
	if err != nil {
		// If the article is not found, abort with an error
		c.AbortWithError(http.StatusNotFound, err)

		// newErrorResponse(c, http.StatusBadRequest, "invalid id param")
		// return
	}

	list, err := h.services.AquahubList.GetDataSetOfSensor(sensorId)
	if err != nil {
		// If an invalid article ID is specified in the URL, abort with an error
		c.AbortWithStatus(http.StatusNotFound)

		// newErrorResponse(c, http.StatusInternalServerError, err.Error())
		// return
	}

	// Call the render function with the title, article and the name of the
	// template
	urlSensorJSON := fmt.Sprintf("/v1data/%d", sensorId)
	render(c, gin.H{
		"title":      "Sensor dataset",
		"SensorJSON": urlSensorJSON,
		"payload":    list}, "sensordataset.html")

	// c.JSON(http.StatusOK, list)
}

//__________________________________________________________________________________________________________

func (h *Handler) getSensorData(c *gin.Context) {
	/*
		analiticList := AnaliticJson{

			Channel: ChannelInfo{
				Name:          "Aqua my",
				Field1:        "Скорость вент. , %",
				Last_entry_id: "1",
			},

			Feeds: []AnaliticFields{
				{"2021-09-13T21:00:00+03:00", "110.0"},
				{"2021-09-13T22:00:00+03:00", "113.0"},
				{"2021-09-13T23:00:00+03:00", "3.0"},
				{"2021-09-14T00:00:00+03:00", "4.0"},
				{"2021-09-14T01:00:00+03:00", "4.5"},
				{"2021-09-14T02:00:00+03:00", "15.0"},
				{"2021-09-14T03:00:00+03:00", "17.0"},
			},
		}
	*/
	var chartSensorJSON AnaliticJson
	chartSensorJSON.Feeds = make([]AnaliticFields, 0)

	// Вызовем у контекста метод Param, указав в качестве аргумента имя параметра.
	// И обернем эту функцию в Atoi, из стандартной библиотеки strconv, для преобразования строки в число.
	sensor_id, err := strconv.Atoi(c.Param("sensorId"))
	if err != nil {
		// If the article is not found, abort with an error
		// c.AbortWithError(http.StatusNotFound, err)
		// newErrorResponse(c, http.StatusBadRequest, "invalid id param")
		fmt.Printf("getSensorData Atoi Error:   %v\n", err.Error())
		c.JSON(http.StatusNotFound, chartSensorJSON)
		return
	}

	nameDeviceSensor, err := h.services.AquahubList.GetNameOfDeviceSensor(sensor_id)
	if err != nil {
		// If an invalid article ID is specified in the URL, abort with an error
		// c.AbortWithStatus(http.StatusNotFound)
		// newErrorResponse(c, http.StatusInternalServerError, err.Error())
		fmt.Printf("getSensorData GetNameOfDeviceSensor Error:   %v\n", err.Error())
		c.JSON(http.StatusNotFound, chartSensorJSON)
		return
	}

	chartSensorJSON.Channel.Name = nameDeviceSensor.NameDevice
	chartSensorJSON.Channel.Field1 = nameDeviceSensor.NameSensor
	chartSensorJSON.Channel.Last_entry_id = "1"

	list, err := h.services.AquahubList.GetDataSetOfSensor(sensor_id)
	if err != nil {
		// If an invalid article ID is specified in the URL, abort with an error
		// c.AbortWithStatus(http.StatusNotFound)
		// newErrorResponse(c, http.StatusInternalServerError, err.Error())

		fmt.Printf("getSensorData GetDataSetOfSensor Error:   %v\n", err.Error())

		c.JSON(http.StatusNotFound, chartSensorJSON)
		return
	}

	var af AnaliticFields
	for _, sd := range list {
		af.Created_At = sd.Db_time
		af.Field1 = sd.Value

		chartSensorJSON.Feeds = append(chartSensorJSON.Feeds, af)
	}

	// file, err := json.MarshalIndent(analiticList, "", " ")
	// file, err := json.Marshal(chartSensorJSON)
	// if err != nil {
	// 	fmt.Printf("analitic json Error:   %v\n", err.Error())
	// }

	// fmt.Printf("analitic json:   %v\nFile: %s\n", analiticList, file)

	// var fm fs.FileMode
	// fm = 0644
	// _ = ioutil.WriteFile("static/850851.json", file, fm)

	/*
		// Реализуем логику получения списка по id.

		// Вызовем у контекста метод Param, указав в качестве аргумента имя параметра.
		// И обернем эту функцию в Atoi, из стандартной библиотеки strconv, для преобразования строки в число.
		sensorId, err := strconv.Atoi(c.Param("sensorId"))
		if err != nil {
			// If the article is not found, abort with an error
			c.AbortWithError(http.StatusNotFound, err)

			// newErrorResponse(c, http.StatusBadRequest, "invalid id param")
			// return
		}

		list, err := h.services.AquahubList.GetDataSetOfSensor(sensorId)
		if err != nil {
			// If an invalid article ID is specified in the URL, abort with an error
			c.AbortWithStatus(http.StatusNotFound)

			// newErrorResponse(c, http.StatusInternalServerError, err.Error())
			// return
		}
	*/

	// str := fmt.Sprintf("%s", file)
	c.JSON(http.StatusOK, chartSensorJSON)
}
