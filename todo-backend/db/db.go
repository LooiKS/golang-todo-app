package db

import (
	"log"
	"os"
	"todo-app/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Db *gorm.DB

func Init() {
	var err error
	dsn := os.Getenv("DB_URL")

	Db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalln(err)
		panic("failed to connect db")
	}
	Db.AutoMigrate(&models.Todo{}, &models.TodoItem{})
}
