package main

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gueronlj/go+react/chat"
	"github.com/gueronlj/go+react/db"
)

var r *gin.Engine

func main() {
	r = gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Content-Length", "Accept", "Access-Control-Allow-Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	hub := chat.NewHub()
	wsHandler := chat.NewHandler(hub)

	//boot up the hub concurrently
	go hub.Run()

	r.POST("/chat/createRoom", wsHandler.CreateRoom)
	r.GET("/chat/joinRoom/:roomId", wsHandler.JoinRoom)
	r.GET("/chat/getRooms/", func(c *gin.Context) {
		db.GetRooms(c)
	})
	r.GET("/chat/getClients/:roomId", wsHandler.GetClients)
	r.GET("/chat/getMessages/:roomId", func(c *gin.Context) {
		db.GetMessages(c)
	})
	r.Run("localhost:8080")
}
