import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import ChatRoomList from './components/ChatRoomList';
import ChatView from './components/ChatView';

// It's a good practice to store the API base URL in a constant or an environment variable.
const API_URL = 'http://127.0.0.1:8000';

function App() {
  // Let's change `user` to hold a user object from the backend, not just a username string.
  // We'll also check localStorage to see if a user was already logged in.
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('chatUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null); // Which room is selected?
  const [error, setError] = useState(null); // State for holding error messages

  useEffect(() => {
    // Only fetch rooms if the user is logged in
    if (user) {
      // Using AbortController is a good practice to cancel fetch requests
      // if the component unmounts before the request is complete.
      const controller = new AbortController();
      const signal = controller.signal;

      const fetchRooms = async () => {
        try {
          // We'll need to send an authentication token once we implement proper login.
          const response = await fetch(`${API_URL}/api/chat/rooms/`, { signal });
          const data = await response.json();
          setRooms(data);
          setError(null); // Clear previous errors
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error("Failed to fetch rooms:", error);
            setError("Failed to fetch chat rooms. Please try again later.");
          }
        }
      };

      fetchRooms();

      // Cleanup function to abort the fetch if the component unmounts
      return () => {
        controller.abort();
      };
    }
  }, [user]); // Re-run this effect when the 'user' state changes.

  // This will be updated to handle a full user object from our backend.
  const handleLogin = (userData) => {
    setUser(userData);
    // Persist user data in localStorage to keep them logged in on refresh.
    localStorage.setItem('chatUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedRoom(null);
    setRooms([]);
    localStorage.removeItem('chatUser');
  };

  const handleSelectRoom = (room) => setSelectedRoom(room);

  return (
    <div className="app-container">
      <h1>Real-time Chat</h1>
      {error && <p className="error-message">{error}</p>}
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="chat-container">
          <div className="welcome-header">
            <h2>Welcome, {user.username}!</h2>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
          <div className="main-layout">
            <ChatRoomList rooms={rooms} onSelectRoom={handleSelectRoom} />
            {selectedRoom && (
              <ChatView room={selectedRoom} user={user.username} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;