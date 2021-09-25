package main

import (
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/spf13/viper"

	"todo-app/controller"
	"todo-app/db"

	"github.com/gin-gonic/gin"
)

func init() {
	if gin.Mode() == "debug" {
		viper.SetConfigFile(".env")
		viper.ReadInConfig()
		os.Setenv("DB_URL", viper.GetString("DB_URL"))
		os.Setenv("PATH", viper.GetString("PATH"))
		os.Setenv("PORT", viper.GetString("PORT"))
	}
}

func main() {
	r := gin.New()
	r.Use(cors.Default())
	db.Init()
	todosGroup := r.Group("/todos")
	{
		todosGroup.POST("/", controller.CreateTodo)
		todosGroup.GET("/", controller.GetTodos)
		todosGroup.GET("/:id", controller.GetTodoById)
		todosGroup.PATCH("/:id", controller.UpdateTodoById)
		todosGroup.DELETE("/:id", controller.DeleteTodo)
	}

	todoItemsGroup := r.Group("/todo-items")
	{
		todoItemsGroup.POST("/", controller.CreateTodoItem)
		todoItemsGroup.PATCH("/:id", controller.UpdateTodoItemById)
		todoItemsGroup.DELETE("/:id", controller.DeleteTodoItem)
	}

	port := os.Getenv("PORT")
	path := os.Getenv("PATH")
	r.Run(path + ":" + port)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Headers", "*")

		if c.Request.Method == "OPTIONS" {
			c.JSON(http.StatusOK, gin.H{})
			return
		}

		c.Next()
	}
}
