package repository

import (
	"context"
	"fmt"

	"cloud.google.com/go/firestore"
	"github.com/gapsi/go-task-service/models"
	"google.golang.org/api/iterator"
)

const collection = "tasks"

type TaskRepository struct {
	client *firestore.Client
}

func NewTaskRepository(client *firestore.Client) *TaskRepository {
	return &TaskRepository{client: client}
}

func (r *TaskRepository) GetAll(ctx context.Context) ([]models.Task, error) {
	var tasks []models.Task
	iter := r.client.Collection(collection).Documents(ctx)
	defer iter.Stop()
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("iterating tasks: %w", err)
		}
		var t models.Task
		if err := doc.DataTo(&t); err != nil {
			return nil, fmt.Errorf("decoding task: %w", err)
		}
		tasks = append(tasks, t)
	}
	if tasks == nil {
		tasks = []models.Task{}
	}
	return tasks, nil
}

func (r *TaskRepository) Create(ctx context.Context, task models.Task) error {
	_, err := r.client.Collection(collection).Doc(task.ID).Set(ctx, task)
	return err
}

func (r *TaskRepository) Update(ctx context.Context, id string, completed bool) error {
	_, err := r.client.Collection(collection).Doc(id).Update(ctx, []firestore.Update{
		{Path: "completed", Value: completed},
	})
	return err
}

func (r *TaskRepository) Delete(ctx context.Context, id string) error {
	_, err := r.client.Collection(collection).Doc(id).Delete(ctx)
	return err
}

func (r *TaskRepository) Exists(ctx context.Context, id string) (bool, error) {
	doc, err := r.client.Collection(collection).Doc(id).Get(ctx)
	if err != nil {
		return false, nil
	}
	return doc.Exists(), nil
}
