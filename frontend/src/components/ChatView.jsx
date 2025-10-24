import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function ChatView({ room, user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch messages for the selected room
    const fetchMessages = async () => {
      const response = await fetch(`http://127.0.0.1:8000/api/chat/rooms/${room.slug}/messages/`);
      const data = await response.json();
      setMessages(data);
    };

    fetchMessages();
  }, [room]); // Re-run this effect when the 'room' prop changes.

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log('Sending message:', newMessage);
    // We will implement the actual message sending logic later.
    setNewMessage('');
  };

  return (
    <div className="chat-view">
      <h2>{room.name}</h2>
      <div className="message-list">
        {messages.map(message => (
          <div key={message.id} className="message">
            <strong>{message.user.username}: </strong>
            <span>{message.content}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="message-form">
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

ChatView.propTypes = {
  room: PropTypes.object.isRequired,
  user: PropTypes.string.isRequired,
};

export default ChatView;
