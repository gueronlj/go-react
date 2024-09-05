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
	r.GET("/chat/getRooms/", wsHandler.GetRooms)
	r.GET("/chat/getClients/:roomId", wsHandler.GetClients)

	r.Run("localhost:8080")
}
