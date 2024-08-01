import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:1000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Login successful');
        localStorage.setItem('token', data.token); // Store token
        navigate('/dashboard'); // Navigate to dashboard
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="welcome-container">
        <img src={logo} alt="SentinelCall Logo" className="logo" />
        <h1>Welcome to SentinelCall</h1>
        <p>Your trusted meeting scheduling system.</p>
      </div>
      <div className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {message && <p className={message.startsWith('Error') ? 'error-message' : 'success-message'}>{message}</p>}
      </div>
    </div>
  );
}

export default Login;
