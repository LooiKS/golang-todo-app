package models

import "time"

type Todo struct {
	ID        uint       `json:"id"`
	Title     string     `json:"title"`
	CreatedAt time.Time  `json:"createdAt"`
	TodoItems []TodoItem `json:"todoItems" gorm:"ForeignKey:TodoId;constraint:OnDelete:CASCADE"`
}
