package main

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/google/uuid"
)

var (
	store = make(map[string]*Task)
	mu    sync.RWMutex
	dbFile = "tasks.json" // opcional: persistir
)

func validStatus(s string) bool {
	return s == string(StatusTodo) || s == string(StatusDoing) || s == string(StatusDone)
}

func loadFromFile() {
	data, err := ioutil.ReadFile(dbFile)
	if err != nil { return }
	var tasks []*Task
	if err := json.Unmarshal(data, &tasks); err != nil { return }
	mu.Lock()
	defer mu.Unlock()
	for _, t := range tasks {
		store[t.ID] = t
	}
}

func saveToFile() {
	mu.RLock()
	defer mu.RUnlock()
	var tasks []*Task
	for _, t := range store {
		tasks = append(tasks, t)
	}
	data, _ := json.MarshalIndent(tasks, "", "  ")
	_ = ioutil.WriteFile(dbFile, data, 0644)
}

func getTasksHandler(w http.ResponseWriter, r *http.Request) {
	mu.RLock()
	defer mu.RUnlock()
	var tasks []*Task
	for _, t := range store {
		tasks = append(tasks, t)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

func createTaskHandler(w http.ResponseWriter, r *http.Request) {
	var in Task
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}
	if in.Title == "" {
		http.Error(w, "title required", http.StatusBadRequest)
		return
	}
	if in.Status == "" {
		in.Status = StatusTodo
	} else if !validStatus(string(in.Status)) {
		http.Error(w, "invalid status", http.StatusBadRequest)
		return
	}
	now := time.Now()
	id := uuid.New().String()
	task := &Task{
		ID: id, Title: in.Title, Description: in.Description,
		Status: in.Status, CreatedAt: now, UpdatedAt: now,
	}
	mu.Lock()
	store[id] = task
	mu.Unlock()
	saveToFile()
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(task)
}

func updateTaskHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	mu.Lock()
	task, ok := store[id]
	mu.Unlock()
	if !ok {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	var in Task
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}
	if in.Title == "" {
		http.Error(w, "title required", http.StatusBadRequest)
		return
	}
	if !validStatus(string(in.Status)) {
		http.Error(w, "invalid status", http.StatusBadRequest)
		return
	}
	task.Title = in.Title
	task.Description = in.Description
	task.Status = in.Status
	task.UpdatedAt = time.Now()
	mu.Lock()
	store[id] = task
	mu.Unlock()
	saveToFile()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(task)
}

func deleteTaskHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	mu.Lock()
	_, ok := store[id]
	if ok {
		delete(store, id)
	}
	mu.Unlock()
	if !ok {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	saveToFile()
	w.WriteHeader(http.StatusNoContent)
}

func seedExample() {
	// optional: seed if empty
	mu.RLock()
	empty := len(store) == 0
	mu.RUnlock()
	if empty {
		now := time.Now()
		t := &Task{ID: "1", Title: "Exemplo: Bem-vindo", Description: "Teste o kanban", Status: StatusTodo, CreatedAt: now, UpdatedAt: now}
		mu.Lock(); store[t.ID]=t; mu.Unlock()
	}
}
