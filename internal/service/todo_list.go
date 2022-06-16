package service

import (
	todo "github.com/AquaEngineering/AquaHub/internal/entities"
	"github.com/AquaEngineering/AquaHub/internal/repository"
)

// Сервис для работы со списками

type TodoListService struct {
	repo repository.TodoList
}

// Также в нашем сервисе и понадобится репозиторий
// Добавим его в качестве поля нашей структуры и будем передавать в конструкторе.
func NewTodoListService(repo repository.TodoList) *TodoListService {
	return &TodoListService{repo: repo}
}

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

// Метод GetAll, который будет принимать id пользователя
// и возвращать слайс списка вместе с ошибкой.
func (s *TodoListService) GetAllTodoOfUser(userId int) ([]todo.TodoList, error) {
	// В сервисе мы будем вызывать аналогичный метод репозитория, поскольку дополнительной бизнес логики тут нет.
	return s.repo.GetAll_TodoOfUser(userId)
}

func (s *TodoListService) GetById(userId, listId int) (todo.TodoList, error) {
	return s.repo.GetById(userId, listId)
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
