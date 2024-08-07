import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import './Loginform.css';

const Loginform = () => {

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
    );
}

export default Loginform;