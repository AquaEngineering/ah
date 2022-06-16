package repository

import (
	"fmt"

	entities "github.com/AquaEngineering/AquaHub/internal/entities"
	"github.com/jmoiron/sqlx"
)

type AuthPostgres struct {
	db *sqlx.DB
}

func NewAuthPostgres(db *sqlx.DB) *AuthPostgres {
	return &AuthPostgres{db: db}
}

// Принимает структуру User в качестве аргумента
// Возвращает ID созданного нового пользователя из БД
func (r *AuthPostgres) CreateUser(user entities.User) (int, error) {
	var id int

	// Составляем запрос вставки в таблицу usersTable
	// $1, $2, $3 - плейсхолдеры в которые подставляются значения при вызове r.db.QueryRow
	query := fmt.Sprintf("INSERT INTO %s (name, login, password_hash, u_token) values ($1, $2, $3, $4) RETURNING id", usersTable)

	// Выполнить запрос
	// Объект row хранит в себе информацию возвращаемую из БД (строка)
	row := r.db.QueryRow(query, user.Name, user.Login, user.Password, user.Token)

	// Достанем из ответа БД переменную id
	if err := row.Scan(&id); err != nil {
		return 0, err // нет переменной id
	}

	return id, nil
}

// Запросить в БД id пользователя
func (r *AuthPostgres) GetUser_LoginPassword(login, password string) (entities.User, error) {
	var user entities.User
	query := fmt.Sprintf("SELECT id FROM %s WHERE login=$1 AND password_hash=$2", usersTable)
	err := r.db.Get(&user, query, login, password)

	return user, err
}

// Запросить по токену список связку:
//    ID_шников пользователя, аквахаба, устройств, сенсоров БД
//    с локальными ID_шниками устройств и сенсоров
// user_id & aquahub_id & device_id & sensor_id <===> local_device_id & local_sensor_id
func (r *AuthPostgres) GetUserHW_fromTokens(h_token, u_token string) ([]entities.SensorDataSet, error) { // user_id, aquahub_id, []{device_id, sensor_id}

	var lists []entities.SensorDataSet

	// Команда INNER JOIN при SELECT помогает выбрать только те записи,
	// которые имеют одинаковое значение в обеих таблицах.
	query := fmt.Sprintf(`SELECT aht.user_id, aht.id AS aquahub_id, dlt.id AS device_id, slt.id AS sensor_id, dlt.local_id AS local_device_id, slt.local_id AS local_sensor_id
							FROM  %s aht
							INNER JOIN %s ut on aht.user_id = ut.id
							INNER JOIN %s dlt on dlt.aquahub_id = aht.id
							INNER JOIN %s slt on slt.device_id = dlt.id
							WHERE ut.u_token = $2 AND aht.h_token = $1
							ORDER BY aht.id, dlt.id, slt.id`,
		aquahubsTable, usersTable, devicesTable, sensorsTable)

	// fmt.Printf("\n\n%s\n\n", query)

	err := r.db.Select(&lists, query, h_token, u_token)

	return lists, err
}

// Запросить по токену список связку:
//    ID_шников пользователя, аквахаба, устройств, сенсоров БД
//    с локальными ID_шниками устройств и сенсоров
// user_id & aquahub_id & device_id & sensor_id <===> local_device_id & local_sensor_id
func (r *AuthPostgres) GetAquahubId_fromTokens(h_token, u_token string) (int, error) {

	// Команда INNER JOIN при SELECT помогает выбрать только те записи,
	// которые имеют одинаковое значение в обеих таблицах.
	query := fmt.Sprintf(`SELECT aht.id
							FROM  %s aht
							INNER JOIN %s ut on aht.user_id = ut.id
							WHERE aht.h_token = $1 AND ut.u_token = $2`,
		aquahubsTable, usersTable)

	// fmt.Printf("\n\n%s\n\n", query)

	var aId int
	err := r.db.Get(&aId, query, h_token, u_token)

	return aId, err
}
