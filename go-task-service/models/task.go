package models

type Task struct {
	ID           string `json:"id" firestore:"id"`
	Title        string `json:"title" firestore:"title"`
	Description  string `json:"description" firestore:"description"`
	CreationDate string `json:"creation_date" firestore:"creation_date"`
	CreationTime string `json:"creation_time" firestore:"creation_time"`
	Completed    bool   `json:"completed" firestore:"completed"`
}
