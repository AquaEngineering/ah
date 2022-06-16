package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"

	"net/http"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"

	"github.com/AquaEngineering/AquaHub/internal/handler"
	"github.com/AquaEngineering/AquaHub/internal/repository"
	"github.com/AquaEngineering/AquaHub/internal/service"
)

type Server struct {
	httpServer *http.Server
}

// @title Todo App API
// @version 1.0
// @description API Server for TodoList Application

// @host localhost:8000
// @BasePath /

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization

func main() {

	// Задаём формат лога JSON
	logrus.SetFormatter(new(logrus.JSONFormatter))
	// logrus.SetReportCaller(true) // печать номеров строк

	// Инициализируем и читаем конфиг
	if err := initConfig(); err != nil {
		logrus.Fatalf("error initializing configs: %s", err.Error())
	}

	// Инициализируем и читаем окружение
	if err := godotenv.Load(); err != nil {
		logrus.Fatalf("error loading env variables: %s", err.Error())
	}

	// Инициализируем и подключимся к БД
	db, err := repository.NewPostgresDB(repository.Config{
		Host:     viper.GetString("db.host"), // из конфига
		Port:     viper.GetString("db.port"),
		Username: viper.GetString("db.username"),
		DBName:   viper.GetString("db.dbname"),
		SSLMode:  viper.GetString("db.sslmode"),
		Password: viper.GetString("db.password"), //os.Getenv("DB_PASSWORD"), // из окружения
	})
	if err != nil {
		logrus.Fatalf("failed to initialize db: %s", err.Error())
	}

	// Внедряем зависимости разных уровней (исходя из "Чистой архитектуры")
	// Внешний слой - БД  - не зависит ни от чего
	// Средний слой - Service - бизнес логика передают данные в БД
	// Внутренний слой - Handler - Обработчики передают данные в бизнес логику
	repos := repository.NewRepository(db)
	services := service.NewService(repos)
	handlers := handler.NewHandler(services)

	// Плавное завершение работы должно гарантировать, что при выходе из приложения
	// мы перестанем принимать все входящие и запросы, но при этом закончим
	// обработку всех текущих запросов и операций в базе данных.
	// Для этого мы будем запускать наш сервер в горутине.

	// Создать и запустить сервер в горутине.
	// Это не блокирует выполнение функций мэйн.
	port := os.Getenv("PORT")
	if port == "" {
		port = os.Getenv("LOCALPORT")
	}

	srv := new(Server)
	go func() {
		// if err := srv.Run(viper.GetString("port"), handlers.InitRoutes()); err != nil {
		if err := srv.Run(port, handlers.InitRoutes()); err != nil {
			// Вывести ошибку и выйти из приложения
			logrus.Fatalf("error occured while running http server: %s", err.Error())
		}
	}()

	// Для наглядности также добавим вывод информации о запуске приложения.
	logrus.Print("TodoApp Started")
	logrus.Printf("PORT = %s", port)

	// Добавим блокировку функции main помощью канала типа os.Signal
	// Запись канала будет происходить, когда процесс, которым выполняется наше приложение,
	// получит сигнал от системы типа SIGINT или SIGTERM - это сигналы юникс системах.
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)
	// Также добавим строку для чтения из канала, которая будет блокировать выполнение главной горутины main.
	<-quit

	// Добавив вывод консоль, информацию о том, что приложение заканчивается
	logrus.Print("TodoApp Shutting Down")

	// Вызовем 2 метода остановки сервера и закрытие всех соединений с базой данных.
	// Это гарантирует нам, что мы закончим выполнение всех текущих операций перед выходом из приложения.
	if err := srv.Shutdown(context.Background()); err != nil {
		logrus.Errorf("error occured on server shutting down: %s", err.Error())
	}

	if err := db.Close(); err != nil {
		logrus.Errorf("error occured on db connection close: %s", err.Error())
	}
}

func initConfig() error {
	viper.AddConfigPath("configs")
	viper.SetConfigName("config")
	return viper.ReadInConfig()
}

func (s *Server) Run(port string, handler http.Handler) error {
	s.httpServer = &http.Server{
		// Инкапсуляция параметров сервера
		Addr:           ":" + port,
		Handler:        handler,
		MaxHeaderBytes: 1 << 20, // 1 MB
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
	}

	return s.httpServer.ListenAndServe() // Бесконечный цикл прослушивания входящих запросов
}

func (s *Server) Shutdown(ctx context.Context) error {
	return s.httpServer.Shutdown(ctx)
}
