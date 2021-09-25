package models

import "time"

type TodoItem struct {
	ID        int       `json:"id"`
	TodoId    uint      `json:"todoId"`
	Title     string    `json:"title"`
	Done      bool      `json:"done"`
	CreatedAt time.Time `json:"createdAt"`
}
