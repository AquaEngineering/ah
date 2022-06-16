package repository

import (
	entities "github.com/AquaEngineering/AquaHub/internal/entities"
	"github.com/jmoiron/sqlx"
)

// Best practices:
// Интерфейсы должны объявляться на том уровне абстракции (в том файле),
// где они используются, а не на том где реализуется

// Определение интерфейсов к сущностям БД (идентичны сущночстям бизнес логики)

type Authorization interface {

	// Принимает структуру User в качестве аргумента
	// Возвращает ID созданного нового пользователя из БД
	CreateUser(user entities.User) (int, error)

	GetUser_LoginPassword(username, password string) (entities.User, error)
	GetUserHW_fromTokens(h_token, u_token string) ([]entities.SensorDataSet, error) // user_id, aquahub_id, []{device_id, sensor_id}
	GetAquahubId_fromTokens(h_token, u_token string) (int, error)
}

type TodoList interface {
	Create(userId int, list entities.TodoList) (int, error)
	GetAll_Todo() ([]entities.TodoList, error)
	GetAll_TodoOfUser(userId int) ([]entities.TodoList, error)
	GetById(userId, listId int) (entities.TodoList, error)
	Delete(userId, listId int) error
	Update(userId, listId int, input entities.UpdateListInput) error
}

type TodoItem interface {
	Create(listId int, item entities.TodoItem) (int, error)
	GetAll(userId, listId int) ([]entities.TodoItem, error)
	GetById(userId, itemId int) (entities.TodoItem, error)
	Delete(userId, itemId int) error
	Update(userId, itemId int, input entities.UpdateItemInput) error
}

type AquahubList interface {
	GetAquahubs_OfUser(userId int) ([]entities.AquahubList, error)
	GetDevices_OfAquahub(aquahubId int) ([]entities.AquahubList, error)
	GetSensors_OfDevice(deviceId int) ([]entities.AquahubList, error)
	GetDataSet_OfSensor(sensorId int) ([]entities.SensorDataSet, error)

	AppendData_OfSensor(list []entities.SensorDataSet) error
	Device_CreateOrUpdate(aquahub_id, device_local_id int, value string) error
	Sensor_CreateOrUpdate(aquahub_id, device_local_id, sensor_local_id int, value string) error

	GetName_DeviceSensor(sensor_id int) (entities.NameOfDeviceSensor, error)
}

// Структура, собирающая интерфейсы в одном месте
type Repository struct {
	Authorization
	TodoList
	TodoItem
	AquahubList
}

// Констрктор структуры интерфейсов к сущностям БД
//
// Внедрение зависимости:
//
func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		Authorization: NewAuthPostgres(db),
		TodoList:      NewTodoListPostgres(db),
		TodoItem:      NewTodoItemPostgres(db),
		AquahubList:   NewAquahubListPostgres(db),
	}
}
