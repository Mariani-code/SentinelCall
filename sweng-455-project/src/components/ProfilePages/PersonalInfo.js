
import './SharedProfile.css';

import { useState, useEffect } from 'react';

function PersonalInfo() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const grabUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:1000/grabInfo', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer: ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setFirstName(data.userI.firstName);
                setLastName(data.userI.lastName);
                setUsername(data.user.username);
                setPassword(data.user.password);
                setEmail(data.user.email);
            }
            else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error ' + error.message);
        }
    }

    useEffect(() => {
        grabUserInfo();
    }, []);

    return (
        <div className="info-container">
            <h1>
                Personal Info
            </h1>
            {message && <p className={message.startsWith('Error') ? 'error-message' : 'success-message'}>{message}</p>}
            <h2>
                First Name
            </h2>
            <input
                type="text"
                value={firstName}
            />
            <h2>
                Last Name
            </h2>
            <input
                type="text"
                value={lastName}
            />
            <h2>
                Username
            </h2>
            <input
                type="text"
                value={username}
            />
            <h2>
                Password
            </h2>
            <input
                type="password"
                value={password}
            />
            <h2>
                Confirm Password
            </h2>
            <input
                type="password"
                value=''
            />
            <h2>
                Email
            </h2>
            <input
                type="text"
                value={email}
            />
            <button>
                Update
            </button>
        </div>
    );
}

export default PersonalInfo;