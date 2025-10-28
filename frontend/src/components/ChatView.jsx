import { useState, useEffect, useRef } from 'react';
import { Form, Button, InputGroup, ListGroup, Alert } from 'react-bootstrap';
import { getMessages } from '../services/api';

function ChatView({ room, user }) {
    console.log('room:', room);
    console.log('user:', user);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);
    // We'll use a ref to hold the WebSocket instance.
    // This prevents it from being re-created on every render.
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Effect to fetch messages when the selected room changes
    // and to set up the WebSocket connection.
    useEffect(() => {
        if (room) {
            // 1. Fetch initial message history via HTTP
            const fetchMessages = async () => {
                try {
                    const data = await getMessages(room.slug, user.tokens.access);
                    setMessages(data);
                    setError(null);
                } catch (err) {
                    setError("Failed to fetch message history. Please try again.");
                    console.error(err);
                }
            };
            fetchMessages();

            // 2. Establish WebSocket connection
            // Note: Use 'ws' for http and 'wss' for https
            const wsUrl = `ws://127.0.0.1:8000/ws/chat/${room.slug}/?token=${user.tokens.access}`;
            const socket = new WebSocket(wsUrl);
            socketRef.current = socket;

            socket.onopen = () => {
                console.log(`WebSocket connected to room: ${room.name}`);
                setError(null);
            };

            socket.onmessage = (e) => {
                const data = JSON.parse(e.data);
                // The backend consumer sends messages with a 'content' key,
                // but our MessageSerializer sends a list with 'user', 'content', etc.
                // We'll normalize the incoming WebSocket message to match our state structure.
                const incomingMessage = {
                    id: data.id,
                    user: data.user,
                    content: data.content, // The consumer uses 'message' key for content
                    timestamp: data.timestamp,
                };
                console.log('Received message:', incomingMessage);
                setMessages(prevMessages => [...prevMessages, incomingMessage]);
            };

            socket.onerror = (e) => {
                console.error("WebSocket error:", e);
                setError("WebSocket connection error. Please refresh the page.");
            };

            socket.onclose = () => {
                console.log(`WebSocket disconnected from room: ${room.name}`);
            };

            // 3. Cleanup on component unmount or room change
            return () => {
                socket.close();
                socketRef.current = null;
            };
        }
    }, [room, user.tokens.access]);

    // Effect to scroll to the bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
      console.log('handleSendMessage called');
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Send message through the WebSocket
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            console.log('Sending message:', newMessage);
            socketRef.current.send(JSON.stringify({
                'message': newMessage
            }));
            setNewMessage('');
        } else {
            setError("WebSocket is not connected. Cannot send message.");
        }
        // We no longer need to manually add the message to the state,
        // as the server will broadcast it back to us.
    };

    return (
        <div className="chat-view">
            <div className="messages-list">
                {error && <Alert variant="danger">{error}</Alert>}
                <ListGroup>
                    {messages.map((msg) => {
                        const messageClass = msg.user === user.username ? 'my-message' : 'other-message';
                        console.log('msg:',msg)
                        console.log("user:",user)
                        return (
                            // Wrapper div to allow alignment within the ListGroup
                            <div key={msg.id} className={`message-wrapper ${messageClass}-wrapper`}>
                                <ListGroup.Item className={messageClass}>
                                    <strong>{msg.user}:</strong> {msg.content}
                                    <div className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                                </ListGroup.Item>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </ListGroup>
            </div>
            <div className="message-input-form">
                <Form onSubmit={handleSendMessage}>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            autoComplete="off"
                        />
                        <Button variant="primary" type="submit">
                            Send
                        </Button>
                    </InputGroup>
                </Form>
            </div>
        </div>
    );
}

export default ChatView;
