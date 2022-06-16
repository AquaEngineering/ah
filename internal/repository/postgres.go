package repository // Определение подключения к БД

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

// Список используемых таблиц
const (
	usersTable      = "users"
	todoListsTable  = "todo_lists"
	usersListsTable = "users_lists"
	todoItemsTable  = "todo_items"
	listsItemsTable = "lists_items"

	aquahubsTable      = "aquahubs"
	devicesTable       = "devices"
	sensorsTable       = "sensors"
	sensorDataSetTable = "sensors_dataset"
)

// Параметры подключения к БД
type Config struct {
	Host     string
	Port     string
	Username string
	Password string
	DBName   string
	SSLMode  string
}

func NewPostgresDB(cfg Config) (*sqlx.DB, error) {

	cfg_psql := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=%s",
		cfg.Host, cfg.Port, cfg.Username, cfg.DBName, cfg.Password, cfg.SSLMode)

	db, err := sqlx.Open("postgres", cfg_psql)
	if err != nil {
		return nil, err
	}

	// Проверим подключение к БД и вернём ошибку
	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return db, nil
}
