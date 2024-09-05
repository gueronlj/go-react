package chat

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type Handler struct {
	hub *Hub
}

func NewHandler(h *Hub) *Handler {
	return &Handler{
		hub: h,
	}
}

type CreateRoomReq struct {
	ID   string `jsonL:"id"`
	Name string `json:"name"`
}

func (h *Handler) CreateRoom(c *gin.Context) {
	var req CreateRoomReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	h.hub.Rooms[req.ID] = &Room{
		ID:      req.ID,
		Name:    req.Name,
		Clients: make(map[string]*Client),
	}
	c.JSON(http.StatusOK, req)
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		//while not testing
		// origin := r.Header.Get("Origin")
		// return origin == "http://localhost:3000"
		return true
	},
}

func (h *Handler) JoinRoom(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	roomID := c.Param("roomId")
	cleintID := c.Query("userId")
	username := c.Query("username")

	cli := &Client{
		Connection: conn,
		Message:    make(chan *Message, 10),
		ID:         cleintID,
		RoomID:     roomID,
		Username:   username,
	}

	msg := &Message{
		Content:  "A new user has joined",
		RoomID:   roomID,
		Username: username,
	}

	//push a client through the join channel
	h.hub.Join <- cli

	//push a message through message channel
	h.hub.Broadcast <- msg

	go cli.writeMessage()

	cli.readMessage(h.hub)
}

// we will need to return json
type RoomResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func (h *Handler) GetRooms(c *gin.Context) {
	rooms := make([]RoomResponse, 0)

	for _, room := range h.hub.Rooms {
		rooms = append(rooms, RoomResponse{
			ID:   room.ID,
			Name: room.Name,
		})
	}

	c.JSON(http.StatusOK, rooms)
}

type ClientResponse struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}

// get all clients from a room by ID
func (h *Handler) GetClients(c *gin.Context) {
	var clients []ClientResponse

	roomId := c.Param("roomId")

	if _, ok := h.hub.Rooms[roomId]; !ok {
		//if not ok (roomId is not in rooms) then create and return an empty slice, size 0
		clients = make([]ClientResponse, 0)
		c.JSON(http.StatusOK, clients)
	}

	for _, client := range h.hub.Rooms[roomId].Clients {
		clients = append(clients, ClientResponse{
			ID:       client.ID,
			Username: client.Username,
		})
	}

	c.JSON(http.StatusOK, clients)
}
