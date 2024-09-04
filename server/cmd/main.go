package main

import (
	"github.com/gin-gonic/gin"
	"github.com/gueronlj/go+react/chat"
)

var r *gin.Engine

func main() {
	r = gin.Default()
	hub := chat.NewHub()
	wsHandler := chat.NewHandler(hub)

	//boot up the hub concurrently
	go hub.Run()

	r.POST("/chat/createRoom", wsHandler.CreateRoom)
	r.GET("/chat/joinRoom/:roomId", wsHandler.JoinRoom)
	//TODO: getRooms route

	r.Run("localhost:8080")
}
