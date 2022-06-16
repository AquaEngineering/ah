package handler

import (
	"net/http"

	"github.com/AquaEngineering/AquaHub/internal/service"

	// Подтянуть фремворк Джин, если не установлен:    go get -u github.com/gin-gonic/gin
	"github.com/gin-gonic/gin"

	_ "github.com/AquaEngineering/AquaHub/docs"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/swaggo/gin-swagger/swaggerFiles"
)

type Handler struct {
	services *service.Service
}

// Конструктор для типа Handler
//
// Внедрение зависимости:
// Обработчики будут обращаться к Сервисам, поэтому в конструктор передаётся указатель
// на структуру интерфейсов к Сервисам
//
func NewHandler(services *service.Service) *Handler {
	return &Handler{services: services}
}

// Метод типа Handler: Инициализация роутера с end-point_ами
func (h *Handler) InitRoutes() *gin.Engine {

	// Инициализируем Джин роутер
	// router := gin.New()
	// Set the router as the default one provided by Gin
	router := gin.Default()

	// Set Gin to production mode
	// gin.SetMode(gin.ReleaseMode)

	// Process the templates at the start so that they don't have to be loaded
	// from the disk again. This makes serving HTML pages very fast.

	// Обрабатываем шаблоны в начале, чтобы их не нужно было загружать
	// снова с диска. Это делает обслуживание HTML-страниц очень быстрым.
	router.LoadHTMLGlob("templates/*")

	router.Static("/static", "static")

	// func initializeRoutes() {

	// Use the setUserStatus middleware for every route to set a flag
	// indicating whether the request was from an authenticated user or not

	// Используйте setUserStatus middleware для каждого маршрута, чтобы установить флаг
	// указание, был ли запрос от аутентифицированного пользователя или нет
	// router.Use(setUserStatus())

	// Handle the index route
	router.GET("/", h.showIndexPage)

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Объявим методы, сгрупприровав по маршрутам

	// Сгруппировать связанные с пользователем маршруты вместе
	userRoutes := router.Group("/u", h.ensureNotLoggedIn_middleware)
	{
		// Handle the GET requests at /u/login
		// Show the login page
		// Ensure that the user is not logged in by using the middleware
		userRoutes.GET("/login", showLoginPage)

		// Handle POST requests at /u/login
		// Ensure that the user is not logged in by using the middleware
		// userRoutes.POST("/login", performLogin)
		userRoutes.POST("/login", h.frontPerformLogin)

		// Handle the GET requests at /u/register
		// Show the registration page
		// Ensure that the user is not logged in by using the middleware
		userRoutes.GET("/register", showRegistrationPage)

		// Handle POST requests at /u/register
		// Ensure that the user is not logged in by using the middleware
		userRoutes.POST("/register", h.frontPerformRegister) // register)

		// Handle GET requests at /u/logout
		// Ensure that the user is logged in by using the middleware
		userRoutes.GET("/logout", ensureLoggedIn(), logout)
	}

	articleRoutes := router.Group("/article", h.ensureLoggedIn_middleware) // Для группы маршрутов "/api" зададим middleware обработчик
	{
		// Handle GET requests at /article/view/some_article_id
		// articleRoutes.GET("/view/:article_id", getArticle)
		articleRoutes.GET("/view/:id", h.getArticleById)

		// Handle the GET requests at /article/create
		// Show the article creation page
		// Ensure that the user is logged in by using the middleware
		// articleRoutes.GET("/create", ensureLoggedIn(), showArticleCreationPage)
		articleRoutes.GET("/create", showArticleCreationPage)

		// Handle POST requests at /article/create
		// Ensure that the user is logged in by using the middleware
		// articleRoutes.POST("/create", ensureLoggedIn(), createArticle)
		articleRoutes.POST("/create", h.createArticleForUser)
	}

	HardWareRoutes := router.Group("/hw", h.ensureLoggedIn_middleware) // Для группы маршрутов "/hw" зададим middleware обработчик
	{
		HardWareRoutes.GET("/analytics", h.showPage_Analytics)                      // Шаблон aquahub.html
		HardWareRoutes.GET("/aquahubs", h.showPage_AquaHubs)                     // Шаблон aquahub.html
		HardWareRoutes.GET("/devices/:aquahubId", h.showPage_Devices)            // Шаблон device.html
		HardWareRoutes.GET("/sensors/:deviceId", h.showPage_Sensors)             // Шаблон sensors.html
		HardWareRoutes.GET("/sensordataset/:sensorId", h.showPage_SensorDataSet) // Шаблон sensordataset.html
	}


	// Сгруппировать вместе маршруты, связанные с API v1
	getDataRoutes := router.Group("/v1data")
	{
		getDataRoutes.GET("/:sensorId", h.getSensorData)
	}

	// Сгруппировать вместе маршруты, связанные с API v1
	apiRoutes := router.Group("/v1", h.checkApiKey)
	{
		// Handle the GET requests at /u/login
		// Show the login page
		// Ensure that the user is not logged in by using the middleware

		// Обработка запросов GET в /v1/sensor
		apiRoutes.GET("/sensor", h.sensorDataStore)

		apiRoutes.GET("/device/add", h.api_DeviceAdd)
		apiRoutes.GET("/device/meta", h.api_DeviceMeta)
		apiRoutes.GET("/sensor/add", h.api_SensorAdd)
		apiRoutes.GET("/sensor/meta", h.api_SensorMeta)
	}

	// Методы авторизации
	auth := router.Group("/auth") // группа маршрутов "/auth"
	{
		auth.POST("/sign-up", h.signUp) // маршрут (end-point) "/auth/sign-up"
		auth.POST("/sign-in", h.signIn) // маршрут (end-point) "/auth/sign-in"
	}

	// Методы работы со списком и итемами
	api := router.Group("/api", h.userIdentity_middleware) // Для группы маршрутов "/api" зададим middleware обработчик
	{
		lists := api.Group("/lists") // группа маршрутов "/api/lists"
		{
			lists.POST("/", h.createList)      // end-point "/api/lists/"
			lists.GET("/", h.getAllLists)      // end-point "/api/lists/"
			lists.GET("/:id", h.getListById)   // end-point "/api/lists/:id", после ":" имя параметра, к которому можно получить доступ ( "id" )
			lists.PUT("/:id", h.updateList)    // end-point "/api/lists/:id", есть параметр "id"
			lists.DELETE("/:id", h.deleteList) // end-point "/api/lists/:id", есть параметр "id"

			items := lists.Group(":id/items") // группа маршрутов "/api/lists/:id/items"
			{
				items.POST("/", h.createItem) // end-point "/api/lists/:id/items/"
				items.GET("/", h.getAllItems) // end-point "/api/lists/:id/items/"
			}
		}

		items := api.Group("items")
		{
			items.GET("/:id", h.getItemById)
			items.PUT("/:id", h.updateItem)
			items.DELETE("/:id", h.deleteItem)
		}
	}

	return router
}

// Render one of HTML, JSON or CSV based on the 'Accept' header of the request
// If the header doesn't specify this, HTML is rendered, provided that
// the template name is present

// Визуализация одного из HTML, JSON или CSV на основе заголовка «Accept» запроса
// Если в заголовке это не указано, отображается HTML при условии, что
// имя шаблона присутствует
func render(c *gin.Context, data gin.H, templateName string) {

	if loggedInInterface, ok := c.Get("is_logged_in"); ok {
		data["is_logged_in"] = loggedInInterface.(bool)
	} else {
		data["is_logged_in"] = false
	}

	switch c.Request.Header.Get("Accept") {
	case "application/json":
		// Respond with JSON
		c.JSON(http.StatusOK, data["payload"])
	case "application/xml":
		// Respond with XML
		c.XML(http.StatusOK, data["payload"])
	default:
		// Respond with HTML
		c.HTML(http.StatusOK, templateName, data)
	}
}
