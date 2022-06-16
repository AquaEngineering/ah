package entities

import (
	"errors"
)

// Поля полностью совпадают с БД
// Добавлены JSON теги чтобы корректно принимать и выводить данные в HTTP-запросах
// Тег binding:"required" - валидирует наличие данного поля в теле запроса (является реализацией фремворка gin)

type AquahubList struct {
	Id          int    `json:"id" db:"id"`
	Title       string `json:"title" db:"title" binding:"required"`
	Description string `json:"description" db:"description"`
}

type NameOfDeviceSensor struct {
	NameDevice string
	NameSensor string
}

type SensorDataSet struct {
	Id         int    `json:"id" db:"id"`
	User_id    int    `json:"user_id" db:"user_id"`
	Aquahub_id int    `json:"aquahub_id" db:"aquahub_id"`
	Device_id  int    `json:"device_id" db:"device_id"`
	Sensor_id  int    `json:"sensor_id" db:"sensor_id"`
	Db_time    string `json:"db_time" db:"db_time"`
	User_time  string `json:"user_time" db:"user_time"`

	// Список связка:
	//    ID_шников пользователя, аквахаба, устройств, сенсоров БД
	//    с локальными ID_шниками устройств и сенсоров
	// user_id & aquahub_id & device_id & sensor_id <===> local_device_id & local_sensor_id

	// По запросу api_v1 приходят данные: Local_device_id, Local_sensor_id, Value
	Local_device_id int `json:"local_device_id" db:"local_device_id"`
	Local_sensor_id int `json:"local_sensor_id" db:"local_sensor_id"`

	Value string `json:"value" db:"value"`
}

//--------------------------------------------------------------------------------------

type AquahubItem struct {
	Id          int    `json:"id" db:"id"`
	Title       string `json:"title" db:"title" binding:"required"`
	Description string `json:"description" db:"description"`
	Done        bool   `json:"done" db:"done"`
}

type AquahubListsItem struct {
	Id     int
	ListId int
	ItemId int
}

type UpdateAquahubListInput struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
}

func (i UpdateAquahubListInput) Validate() error {
	if i.Title == nil && i.Description == nil {
		return errors.New("update structure has no values")
	}

	return nil
}

type UpdateAquahubItemInput struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
	Done        *bool   `json:"done"`
}

func (i UpdateAquahubItemInput) Validate() error {
	if i.Title == nil && i.Description == nil && i.Done == nil {
		return errors.New("update structure has no values")
	}

	return nil
}
