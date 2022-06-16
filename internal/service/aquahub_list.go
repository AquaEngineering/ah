package service

import (
	entities "github.com/AquaEngineering/AquaHub/internal/entities"
	"github.com/AquaEngineering/AquaHub/internal/repository"
)

// Сервис для работы со списками

type AquahubListService struct {
	repo repository.AquahubList
}

// Также в нашем сервисе и понадобится репозиторий
// Добавим его в качестве поля нашей структуры и будем передавать в конструкторе.
func NewAquahubListService(repo repository.AquahubList) *AquahubListService {
	return &AquahubListService{repo: repo}
}

/*
// При создании списка мы будем передавать данные на следующий уровень - в репозиторий,
// поэтому в сервисе мы лишь будем возвращать аналогичный метод репозитория.
// Дополнительной логики мы реализовывать не будем.
func (s *TodoListService) Create(userId int, list todo.TodoList) (int, error) {
	return s.repo.Create(userId, list)
}

// Метод GetAll, который будет возвращать слайс списка вместе с ошибкой.
func (s *TodoListService) GetAllTodo() ([]todo.TodoList, error) {
	// В сервисе мы будем вызывать аналогичный метод репозитория, поскольку дополнительной бизнес логики тут нет.
	return s.repo.GetAll_Todo()
}



func (s *TodoListService) Delete(userId, listId int) error {
	return s.repo.Delete(userId, listId)
}

func (s *TodoListService) Update(userId, listId int, input todo.UpdateListInput) error {
	if err := input.Validate(); err != nil {
		return err
	}

	return s.repo.Update(userId, listId, input)
}
*/

// Метод GetAll, который будет принимать id пользователя
// и возвращать слайс списка вместе с ошибкой.
func (s *AquahubListService) GetAllAquahubOfUser(userId int) ([]entities.AquahubList, error) {
	// В сервисе мы будем вызывать аналогичный метод репозитория, поскольку дополнительной бизнес логики тут нет.
	return s.repo.GetAquahubs_OfUser(userId)
}

func (s *AquahubListService) GetDevicesOfAquahub(aquahubId int) ([]entities.AquahubList, error) {
	return s.repo.GetDevices_OfAquahub(aquahubId)
}

func (s *AquahubListService) GetSensorsOfDevice(deviceId int) ([]entities.AquahubList, error) {
	return s.repo.GetSensors_OfDevice(deviceId)
}

func (s *AquahubListService) GetDataSetOfSensor(sensorId int) ([]entities.SensorDataSet, error) {
	return s.repo.GetDataSet_OfSensor(sensorId)
}

func (s *AquahubListService) AppendDataOfSensor(list []entities.SensorDataSet) error {
	return s.repo.AppendData_OfSensor(list)
}

func (s *AquahubListService) DeviceCreateOrUpdate(aquahub_id int, device_local_id int, value string) error {
	return s.repo.Device_CreateOrUpdate(aquahub_id, device_local_id, value)
}

func (s *AquahubListService) SensorCreateOrUpdate(aquahub_id, device_local_id, sensor_local_id int, value string) error {
	return s.repo.Sensor_CreateOrUpdate(aquahub_id, device_local_id, sensor_local_id, value)
}

func (s *AquahubListService) GetNameOfDeviceSensor(sensor_id int) (entities.NameOfDeviceSensor, error) {
	return s.repo.GetName_DeviceSensor(sensor_id)
}
