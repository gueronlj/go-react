package chat

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/gueronlj/go+react/db"
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
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func (h *Handler) CreateRoom(c *gin.Context) {
	var req CreateRoomReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create a new Room object
	newRoom := &Room{
		ID:      req.ID,
		Name:    req.Name,
		Clients: make(map[int]*Client),
	}
	// Store the new Room in the database
	dbRoom := db.Room{
		ID:   newRoom.ID,
		Name: newRoom.Name,
	}
	_, err := db.CreateRoom(dbRoom)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create room in database"})
		return
	}
	// Add the new Room to the hub's Rooms map
	h.hub.Rooms[req.ID] = newRoom
	// Respond to the client with the created room
	c.JSON(http.StatusOK, req)
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		//while not testing
		//origin := r.Header.Get("Origin")
		//return origin == "http://localhost:5173"

		//whilke testing
		return true
	},
}

func (h *Handler) JoinRoom(c *gin.Context) {
	//when a client joins a room, ugrade to websocket connection
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	roomIDStr := c.Param("roomId")
	roomID, err := strconv.Atoi(roomIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	clientIDStr := c.Query(("userId"))
	clientID, err := strconv.Atoi(clientIDStr)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid room ID"})
		return
	}
	username := c.Query("username")
	cli := &Client{
		Connection: conn,
		Message:    make(chan *Message, 25),
		ID:         clientID,
		RoomID:     roomID,
		Username:   username,
	}
	msg := &Message{
		Content:   username + " has joined",
		RoomID:    roomID,
		Username:  username,
		ServerMsg: true,
	}
	//push the client through the join channel
	h.hub.Join <- cli
	//push the on join message through message channel
	h.hub.Broadcast <- msg
	//start the reading and writing listeners
	go cli.writeMessage()
	cli.readMessage(h.hub)
}

// we will need to return json
type RoomResponse struct {
	ID   int    `json:"id"`
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
	roomIdStr := c.Param("roomId")
	roomId, err := strconv.Atoi(roomIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid room ID"})
		return
	}

	if _, ok := h.hub.Rooms[roomId]; !ok {
		// If not ok (roomId is not in rooms) then create and return an empty slice, size 0
		clients = make([]ClientResponse, 0)
		c.JSON(http.StatusOK, clients)
		return
	}

	for _, client := range h.hub.Rooms[roomId].Clients {
		clients = append(clients, ClientResponse{
			ID:       strconv.Itoa(client.ID), // Convert int to string
			Username: client.Username,
		})
	}
	c.JSON(http.StatusOK, clients)
}
