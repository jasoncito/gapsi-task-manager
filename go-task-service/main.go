package main

import (
	"context"
	"log"
	"net/http"

	"cloud.google.com/go/firestore"
	"github.com/gapsi/go-task-service/config"
	"github.com/gapsi/go-task-service/handlers"
	"github.com/gapsi/go-task-service/repository"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env when present (ignored in production where env vars are injected directly)
	if err := godotenv.Load(); err != nil {
		log.Println("no .env file found, using environment variables")
	}

	cfg := config.Load()

	ctx := context.Background()
	// Database ID is "default" (without parentheses) — Firebase-style naming used by this project
	firestoreClient, err := firestore.NewClientWithDatabase(ctx, cfg.ProjectID, "default")
	if err != nil {
		log.Fatalf("failed to create Firestore client: %v", err)
	}
	defer firestoreClient.Close()

	repo := repository.NewTaskRepository(firestoreClient)
	taskHandler := handlers.NewTaskHandler(repo)

	mux := http.NewServeMux()
	mux.Handle("/tasks", taskHandler)
	mux.Handle("/tasks/", taskHandler)
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	log.Printf("go-task-service listening on :%s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, mux); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
