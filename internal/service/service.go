package service

import (
	entities "github.com/AquaEngineering/AquaHub/internal/entities"
	"github.com/AquaEngineering/AquaHub/internal/repository"
)

// Интерфейсы должны объявляться на том уровне абстракции (в том файле),
// где они используются, а не на том где реализуется

// Определение интерфейсов к сущностям бизнес логики

//go:generate mockgen -source=service.go -destination=mocks/mock.go

type Authorization interface {
	// Принимает структуру User в качестве аргумента
	// Возвращает ID созданного нового пользователя из БД
	CreateUser(user entities.User) (int, error)
	GenerateToken(username, password string) (string, error)
	ParseToken(token string) (int, error)

	GetUserHWfromTokens(h_token, u_token string) ([]entities.SensorDataSet, error) // user_id, aquahub_id, []{device_id, sensor_id}
	GetAquahubIdfromTokens(h_token, u_token string) (int, error)
}

type TodoList interface {
	Create(userId int, list entities.TodoList) (int, error)
	GetAllTodo() ([]entities.TodoList, error)
	GetAllTodoOfUser(userId int) ([]entities.TodoList, error)
	GetById(userId, listId int) (entities.TodoList, error)
	Delete(userId, listId int) error
	Update(userId, listId int, input entities.UpdateListInput) error
}

type TodoItem interface {
	Create(userId, listId int, item entities.TodoItem) (int, error)
	GetAll(userId, listId int) ([]entities.TodoItem, error)
	GetById(userId, itemId int) (entities.TodoItem, error)
	Delete(userId, itemId int) error
	Update(userId, itemId int, input entities.UpdateItemInput) error
}

type AquahubList interface {
	GetAllAquahubOfUser(userId int) ([]entities.AquahubList, error)
	GetDevicesOfAquahub(aquahubId int) ([]entities.AquahubList, error)
	GetSensorsOfDevice(deviceId int) ([]entities.AquahubList, error)
	GetDataSetOfSensor(sensorId int) ([]entities.SensorDataSet, error)

	AppendDataOfSensor(list []entities.SensorDataSet) error

	DeviceCreateOrUpdate(aquahub_id, device_local_id int, value string) error
	SensorCreateOrUpdate(aquahub_id, device_local_id, sensor_local_id int, value string) error
	GetNameOfDeviceSensor(sensor_id int) (entities.NameOfDeviceSensor, error)
}

// Структура, собирающая интерфейсы в одном месте
type Service struct {
	Authorization
	TodoList
	TodoItem
	AquahubList
}

// Констрктор структуры интерфейсов сервисов.
//
// Внедрение зависимости:
// Сервисы будут обращаться к БД, поэтому в конструктор передаётся указатель
// на структуру интерфейсов к БД
//
func NewService(repos *repository.Repository) *Service {
	return &Service{
		Authorization: NewAuthService(repos.Authorization),
		TodoList:      NewTodoListService(repos.TodoList),
		TodoItem:      NewTodoItemService(repos.TodoItem, repos.TodoList),
		AquahubList:   NewAquahubListService(repos.AquahubList),
	}
}
