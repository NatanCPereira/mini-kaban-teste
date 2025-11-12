package main

import "time"

type TaskStatus string

const (
	StatusTodo    TaskStatus = "todo"
	StatusDoing   TaskStatus = "doing"
	StatusDone    TaskStatus = "done"
)

type Task struct {
	ID          string     `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description,omitempty"`
	Status      TaskStatus `json:"status"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}
