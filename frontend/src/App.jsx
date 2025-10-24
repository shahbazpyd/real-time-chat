import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. STATE: Create a state variable to hold our chat rooms.
  // 'rooms' is the current value, 'setRooms' is the function to update it.
  const [rooms, setRooms] = useState([]);

  // 2. EFFECT: This will run once when the component first loads.
  useEffect(() => {
    // Define an async function inside the effect to fetch data.
    const fetchRooms = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/chat/rooms/');
      const data = await response.json();
      setRooms(data); // Update our state with the fetched rooms
    };

    fetchRooms();
  }, []); // The empty array [] means this effect runs only once.

  return (
    <div>
      <h1>Real-time Chat</h1>
      <h2>Chat Rooms</h2>
      <ul>
        {/* 3. RENDER: Map over the rooms in our state and display them. */}
        {rooms.map(room => <li key={room.id}>{room.name}</li>)}
      </ul>
    </div>
  );
}

export default App;