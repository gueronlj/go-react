package chat

import (
	"fmt"
	"math/rand"

	"github.com/gueronlj/go+react/db"
)

type Room struct {
	ID      int             `json:"id"`
	Name    string          `json:"name"`
	Clients map[int]*Client `json:"clients"`
}

type Hub struct {
	Rooms     map[int]*Room
	Join      chan *Client
	Leave     chan *Client
	Broadcast chan *Message
}

func NewHub() *Hub {
	rooms, err := db.GetRooms(nil) // Passing nil as we don't have a gin.Context here
	if err != nil {
		fmt.Printf("Error fetching rooms: %v\n", err)
		// Initialize with an empty map if there's an error
		rooms = []db.Room{}
	}

	// Convert []db.Room to map[int]*Room
	roomMap := make(map[int]*Room)
	for _, dbRoom := range rooms {
		roomMap[dbRoom.ID] = &Room{
			ID:      dbRoom.ID,
			Name:    dbRoom.Name,
			Clients: make(map[int]*Client),
		}
	}

	return &Hub{
		Rooms:     roomMap,
		Join:      make(chan *Client),
		Leave:     make(chan *Client),
		Broadcast: make(chan *Message, 5),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case cl := <-h.Join:
			// Check if room exists, if not, create it
			if _, exists := h.Rooms[cl.RoomID]; !exists {
				h.Rooms[cl.RoomID] = &Room{
					ID:      cl.RoomID,
					Name:    fmt.Sprintf("Room %d", cl.RoomID), // You might want to set a proper name
					Clients: make(map[int]*Client),
				}
			}
			// Add client to the room
			h.Rooms[cl.RoomID].Clients[cl.ID] = cl
		case cl := <-h.Leave:
			if _, exists := h.Rooms[cl.RoomID]; exists {
				if _, exists := h.Rooms[cl.RoomID].Clients[cl.ID]; exists {

					//if there are any clients left in the room, beroadcast a message when a client leaves
					if len(h.Rooms[cl.RoomID].Clients) != 0 {
						//send a reference of Message through broadcastg channel
						h.Broadcast <- &Message{
							Content:   fmt.Sprintf("%v left the chat", cl.Username),
							RoomID:    cl.RoomID,
							Username:  cl.Username,
							UserId:    cl.ID,
							ServerMsg: true,
						}
					}
					//delete client ID from the room in the client's map
					delete(h.Rooms[cl.RoomID].Clients, cl.ID)
					//close the message channel of the client
					close(cl.Message)
				}
			}

		case message := <-h.Broadcast:
			//if the message's roomID is in the hub's room map
			if _, exists := h.Rooms[message.RoomID]; exists {
				// Check for "typing" message
				if message.Content == "client_typing" {
					// Create a new message for "<username> is typing"
					typingMessage := &Message{
						Content:   fmt.Sprintf("%s is typing", message.Username),
						RoomID:    message.RoomID,
						Username:  message.Username,
						UserId:    message.UserId,
						ServerMsg: true,
					}
					for _, cl := range h.Rooms[message.RoomID].Clients {
						cl.Message <- typingMessage
					}
				} else {
					// Only store non-join and non-leave messages
					if !isJoinOrLeaveMessage(message.Content, message.Username) {
						fmt.Println("storing message!") // Check if the message is not a join or leave message
						go func() {
							dbMessage := db.Message{
								Content:  message.Content,
								Username: message.Username,
								Room_Id:  message.RoomID,
								ID:       rand.Intn(100000), // Generate a random integer between 0 and 99999
							}
							_, err := db.StoreMessage(dbMessage)
							if err != nil {
								fmt.Printf("Error storing message: %v\n", err)
							}
						}()
					}
					// For non-typing messages, send to all clients in the room
					for _, cl := range h.Rooms[message.RoomID].Clients {
						cl.Message <- message
					}
				}
			}
		}
	}
}

func isJoinOrLeaveMessage(content, username string) bool {
	if content == fmt.Sprintf("%s has joined", username) || content == fmt.Sprintf("%s has left the chat", username) {
		return true
	} else {
		return false
	}
}
