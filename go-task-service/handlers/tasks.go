package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gapsi/go-task-service/models"
	"github.com/gapsi/go-task-service/repository"
	"github.com/google/uuid"
)

type TaskHandler struct {
	repo *repository.TaskRepository
}

func NewTaskHandler(repo *repository.TaskRepository) *TaskHandler {
	return &TaskHandler{repo: repo}
}

const maxBodyBytes = 1 << 20 // 1 MB

func (h *TaskHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, maxBodyBytes)

	path := strings.TrimPrefix(r.URL.Path, "/tasks")
	path = strings.TrimPrefix(path, "/")
	id := path

	switch {
	case r.Method == http.MethodGet && id == "":
		h.listTasks(w, r)
	case r.Method == http.MethodPost && id == "":
		h.createTask(w, r)
	case r.Method == http.MethodPatch && id != "":
		h.updateTask(w, r, id)
	case r.Method == http.MethodDelete && id != "":
		h.deleteTask(w, r, id)
	default:
		jsonError(w, "not found", http.StatusNotFound)
	}
}

func (h *TaskHandler) listTasks(w http.ResponseWriter, r *http.Request) {
	tasks, err := h.repo.GetAll(r.Context())
	if err != nil {
		jsonError(w, "failed to fetch tasks", http.StatusInternalServerError)
		return
	}
	jsonResponse(w, tasks, http.StatusOK)
}

const maxTitleLen = 200
const maxDescLen = 2000

func (h *TaskHandler) createTask(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Title       string `json:"title"`
		Description string `json:"description"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonError(w, "invalid request body", http.StatusBadRequest)
		return
	}

	title := strings.TrimSpace(body.Title)
	description := strings.TrimSpace(body.Description)

	if title == "" {
		jsonError(w, "title is required", http.StatusBadRequest)
		return
	}
	if len(title) > maxTitleLen || len(description) > maxDescLen {
		jsonError(w, "title or description exceeds maximum length", http.StatusBadRequest)
		return
	}

	now := time.Now()
	task := models.Task{
		ID:           uuid.NewString(),
		Title:        title,
		Description:  description,
		CreationDate: now.Format("02-Jan-06"),
		CreationTime: now.Format("15:04"),
		Completed:    false,
	}

	if err := h.repo.Create(r.Context(), task); err != nil {
		log.Printf("ERROR creating task: %v", err)
		jsonError(w, "failed to create task", http.StatusInternalServerError)
		return
	}
	jsonResponse(w, task, http.StatusCreated)
}

func (h *TaskHandler) updateTask(w http.ResponseWriter, r *http.Request, id string) {
	var body struct {
		Completed bool `json:"completed"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonError(w, "invalid request body", http.StatusBadRequest)
		return
	}

	exists, err := h.repo.Exists(r.Context(), id)
	if err != nil || !exists {
		jsonError(w, "task not found", http.StatusNotFound)
		return
	}

	if err := h.repo.Update(r.Context(), id, body.Completed); err != nil {
		jsonError(w, "failed to update task", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *TaskHandler) deleteTask(w http.ResponseWriter, r *http.Request, id string) {
	exists, err := h.repo.Exists(r.Context(), id)
	if err != nil || !exists {
		jsonError(w, "task not found", http.StatusNotFound)
		return
	}

	if err := h.repo.Delete(r.Context(), id); err != nil {
		jsonError(w, "failed to delete task", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func jsonResponse(w http.ResponseWriter, data interface{}, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func jsonError(w http.ResponseWriter, msg string, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}
