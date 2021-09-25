package controller

import (
	"fmt"
	"net/http"
	"strconv"
	"todo-app/db"
	"todo-app/models"

	"github.com/gin-gonic/gin"
)

func CreateTodoItem(c *gin.Context) {
	var todoItem models.TodoItem
	err := c.ShouldBindJSON(&todoItem)
	if err != nil {
		c.JSON(http.StatusBadRequest, err)
		return
	}

	if todoItem.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Title must not be blank"})
		return
	}
	tx := db.Db.Create(&todoItem)
	if tx.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "try again later"})
		return
	}
	c.JSON(http.StatusCreated, todoItem)
}

func UpdateTodoItemById(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "try again later"})
		return
	}

	var todoItem models.TodoItem
	tx := db.Db.First(&todoItem, id)
	if tx.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Todo item not found"})
		return
	}

	var item map[string]interface{}
	c.Bind(&item)
	if title, ok := item["title"]; ok && title != "" {
		todoItem.Title = fmt.Sprint(title)
	}

	if _, ok := item["done"]; ok {
		todoItem.Done, err = strconv.ParseBool(fmt.Sprint(item["done"]))
		fmt.Println(err)
	}

	db.Db.Save(&todoItem)

	c.JSON(http.StatusOK, todoItem)
}

func DeleteTodoItem(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "try again later"})
		return
	}

	db.Db.Delete(&models.TodoItem{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "ok"})
}
