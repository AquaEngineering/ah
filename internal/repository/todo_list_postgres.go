package repository

import (
	"fmt"
	"strings"

	todo "github.com/AquaEngineering/AquaHub/internal/entities"
	"github.com/jmoiron/sqlx"
	"github.com/sirupsen/logrus"
)

type TodoListPostgres struct {
	db *sqlx.DB
}

func NewTodoListPostgres(db *sqlx.DB) *TodoListPostgres {
	return &TodoListPostgres{db: db}
}

func (r *TodoListPostgres) Create(userId int, list todo.TodoList) (int, error) {
	// Для того, чтобы создать списки в базе данных, нам необходимо провести 2 операции вставки:
	//  - сначала в таблицу todoLists,
	//  - потом в таблицу usersLists, которая связывает пользователей с их списками.
	// Поэтому данные операции мы будем проводить в транзакции.
	// Транзакция это последовательность нескольких операций,
	// которая рассматривается как одна операция.
	// Транзакция либо выполняется целиком, либо не выполняется вообще.

	// Для создания транзакции в объекте db есть метод Begin.
	// Создадим новую транзакцию, в которой выполним 2 операции вставки.
	tx, err := r.db.Begin()
	if err != nil {
		return 0, err
	}

	// Выполним запрос для создания записи в таблице todoLists.
	// Возвращаем id нового списка
	var id int
	createListQuery := fmt.Sprintf("INSERT INTO %s (title, description) VALUES ($1, $2) RETURNING id", todoListsTable)
	row := tx.QueryRow(createListQuery, list.Title, list.Description)
	if err := row.Scan(&id); err != nil {
		tx.Rollback()
		return 0, err
	}

	// Сделаем вставку в таблицу usersLists, в которой свяжем id пользователя и id нового списка.
	createUsersListQuery := fmt.Sprintf("INSERT INTO %s (user_id, list_id) VALUES ($1, $2)", usersListsTable)

	// Для простого выполнения запроса, без чтения возвращаемой информации воспользуемся методом Exec.
	_, err = tx.Exec(createUsersListQuery, userId, id)
	if err != nil {
		tx.Rollback() // В случае ошибок мы вызываем метод Rollback, которая откатывает все изменения БД до начала выполнения транзакции.
		return 0, err
	}

	// После выполнения транзакции вызовем метод Commit, который применит изменения к БД и закончит транзакцию.
	return id, tx.Commit()
}

func (r *TodoListPostgres) GetAll_Todo() ([]todo.TodoList, error) {
	var lists []todo.TodoList // Создадим слайс списка

	// Подготовим запрос.
	// tl.id, tl.title, tl.description - возвращаемые поля
	query := fmt.Sprintf("SELECT tl.id, tl.title, tl.description FROM %s tl", todoListsTable)

	// На этот раз мы используем для выборки из базы метод селект.
	// Он работает аналогично с методом Get только применяется при выборке больше одного элемента
	// и результат записывает в слайс.
	err := r.db.Select(&lists, query)

	return lists, err
}

//_____________________________________________________________________________________________________

func (r *TodoListPostgres) GetAll_TodoOfUser(userId int) ([]todo.TodoList, error) {

	var lists []todo.TodoList // Создадим слайс списка

	// Подготовим запрос.
	// В нем мы будем делать выборку из базы, используя конструкцию INNER JOIN.
	// Команда INNER JOIN при SELECT помогает выбрать только те записи,
	// которые имеют одинаковое значение в обеих таблицах.
	// В нашем случае нам нужно выбрать все записи из таблицы списков, которые также есть в таблице usersLists,
	// и при этом связаны id пользователя.
	// tl.id, tl.title, tl.description - возвращаемые поля
	query := fmt.Sprintf("SELECT tl.id, tl.title, tl.description FROM %s tl INNER JOIN %s ul on tl.id = ul.list_id WHERE ul.user_id = $1",
		todoListsTable, usersListsTable)

	// На этот раз мы используем для выборки из базы метод селект.
	// Он работает аналогично с методом Get только применяется при выборке больше одного элемента
	// и результат записывает в слайс.
	// Также нам нужно добавить такие дебилы нашу структуру, чтобы иметь возможность делать выборки из базы.
	err := r.db.Select(&lists, query, userId)

	return lists, err
}

func (r *TodoListPostgres) GetById(userId, listId int) (todo.TodoList, error) {
	var list todo.TodoList

	/*
	   SELECT tl.id, tl.title, tl.description FROM todo_lists tl
	    INNER JOIN users_lists ul on tl.id = ul.list_id
	    WHERE ul.user_id = $1 AND ul.list_id = $2

	   $1 = userId
	   $2 = listId
	*/

	query := fmt.Sprintf(`SELECT tl.id, tl.title, tl.description FROM %s tl
								INNER JOIN %s ul on tl.id = ul.list_id WHERE ul.user_id = $1 AND ul.list_id = $2`,
		todoListsTable, usersListsTable)
	err := r.db.Get(&list, query, userId, listId)

	return list, err
}

func (r *TodoListPostgres) Delete(userId, listId int) error {
	query := fmt.Sprintf("DELETE FROM %s tl USING %s ul WHERE tl.id = ul.list_id AND ul.user_id=$1 AND ul.list_id=$2",
		todoListsTable, usersListsTable)
	_, err := r.db.Exec(query, userId, listId)

	return err
}

func (r *TodoListPostgres) Update(userId, listId int, input todo.UpdateListInput) error {
	setValues := make([]string, 0)
	args := make([]interface{}, 0)
	argId := 1

	if input.Title != nil {
		setValues = append(setValues, fmt.Sprintf("title=$%d", argId))
		args = append(args, *input.Title)
		argId++
	}

	if input.Description != nil {
		setValues = append(setValues, fmt.Sprintf("description=$%d", argId))
		args = append(args, *input.Description)
		argId++
	}

	// title=$1
	// description=$1
	// title=$1, description=$2
	setQuery := strings.Join(setValues, ", ")

	query := fmt.Sprintf("UPDATE %s tl SET %s FROM %s ul WHERE tl.id = ul.list_id AND ul.list_id=$%d AND ul.user_id=$%d",
		todoListsTable, setQuery, usersListsTable, argId, argId+1)
	args = append(args, listId, userId)

	logrus.Debugf("updateQuery: %s", query)
	logrus.Debugf("args: %s", args)

	_, err := r.db.Exec(query, args...)
	return err
}
