package entities

// Поля полностью совпадают с БД кроме пароля - в БД хеш пароля

// Добавлены JSON теги чтобы корректно принимать и выводить данные в HTTP-запросах:
// Тег binding:"required" - валидирует наличие данного поля в теле запроса (является реализацией фремворка gin)
type User struct {
	Id       int    `json:"-" db:"id"`
	Name     string `json:"name" binding:"required"`
	Login    string `json:"login" binding:"required"`
	Password string `json:"password" binding:"required"`
	Token    string `json:"token" binding:"required"`
}
