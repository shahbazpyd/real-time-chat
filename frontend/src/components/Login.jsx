import { useState } from 'react';
import PropTypes from 'prop-types';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter Chat</h2>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
      <button type="submit">Login</button>
    </form>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
