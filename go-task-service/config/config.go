package config

import "os"

type Config struct {
	ProjectID string
	Port      string
}

func Load() Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	return Config{
		ProjectID: os.Getenv("GCP_PROJECT_ID"),
		Port:      port,
	}
}
