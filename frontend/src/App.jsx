import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import ChatRoomList from './components/ChatRoomList';
import ChatView from './components/ChatView';

function App() {
  const [user, setUser] = useState(null); // Is the user logged in?
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null); // Which room is selected?

  useEffect(() => {
    // Only fetch rooms if the user is logged in
    if (user) {
      const fetchRooms = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/chat/rooms/');
          const data = await response.json();
          setRooms(data);
        } catch (error) {
          console.error("Failed to fetch rooms:", error);
        }
      };

      fetchRooms();
    }
  }, [user]); // Re-run this effect when the 'user' state changes.

  const handleLogin = (username) => setUser(username);
  const handleSelectRoom = (room) => setSelectedRoom(room);

  return (
    <div className="app-container">
      <h1>Real-time Chat</h1>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="chat-container">
          <h2>Welcome, {user}!</h2>
          <div className="main-layout">
            <ChatRoomList rooms={rooms} onSelectRoom={handleSelectRoom} />
            {selectedRoom && (
              <ChatView room={selectedRoom} user={user} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;