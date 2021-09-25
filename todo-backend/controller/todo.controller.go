package controller

import (
	"fmt"
	"net/http"
	"strconv"

	"todo-app/db"
	"todo-app/models"

	"github.com/gin-gonic/gin"
)

func CreateTodo(c *gin.Context) {
	var t models.Todo
	err := c.Bind(&t)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "try again later"})
		return
	}

	db.Db.Create(&t)
	t.TodoItems = make([]models.TodoItem, 0)
	c.JSON(http.StatusCreated, t)
}

func GetTodos(c *gin.Context) {
	var todos []models.Todo
	db.Db.Preload("TodoItems").Find(&todos)
	c.JSON(http.StatusOK, todos)
}

func GetTodoById(c *gin.Context) {
	var todo models.Todo
	tx := db.Db.Preload("TodoItems").First(&todo, c.Param("id"))
	if tx.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "todo not found"})
		return
	}
	fmt.Println(tx.Error)
	c.JSON(http.StatusOK, todo)
}

func UpdateTodoById(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "id must be int"})
	}

	var todo models.Todo
	tx := db.Db.First(&todo, id)
	if tx.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Todo not found"})
		return
	}

	var json map[string]interface{}
	c.Bind(&json)
	todo.Title = fmt.Sprint(json["title"])
	db.Db.Save(&todo)
	c.JSON(http.StatusOK, todo)
}

func DeleteTodo(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "id must be int"})
	}

	db.Db.Delete(&models.Todo{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "ok"})
}
