package chat

import "fmt"

type Room struct {
	ID      string             `json:"id"`
	Name    string             `json:"name"`
	Clients map[string]*Client `json:"clients"`
}

type Hub struct {
	Rooms     map[string]*Room
	Join      chan *Client
	Leave     chan *Client
	Broadcast chan *Message
}

func NewHub() *Hub {
	return &Hub{
		Rooms: make(map[string]*Room),
		Join:  make(chan *Client),
		Leave: make(chan *Client),
		//Broadcast channel will be buffered channel of size 5
		Broadcast: make(chan *Message, 5),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case cl := <-h.Join:
			//check if room id exists
			if _, exists := h.Rooms[cl.RoomID]; exists {
				//add roomId to hub's Room map
				r := h.Rooms[cl.RoomID]
				//add client ID to room's client map
				r.Clients[cl.ID] = cl
			}
		case cl := <-h.Leave:
			if _, exists := h.Rooms[cl.RoomID]; exists {
				if _, exists := h.Rooms[cl.RoomID].Clients[cl.ID]; exists {

					//if there are any clients left in the room, beroadcast a message when a client leaves
					if len(h.Rooms[cl.RoomID].Clients) != 0 {
						//send a reference of Message through broadcastg channel
						h.Broadcast <- &Message{
							Content:  fmt.Sprintf("%v left the chat", cl.Username),
							RoomID:   cl.RoomID,
							Username: cl.Username,
							UserId:   cl.ID,
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
				//send the message to each client in the room
				for _, cl := range h.Rooms[message.RoomID].Clients {
					cl.Message <- message
				}
			}
		}
	}
}
