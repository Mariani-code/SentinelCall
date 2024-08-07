
import './SharedProfile.css';

import { useState, useLayoutEffect } from 'react';

function PersonalInfo() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const grabUserInfo = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:1000/grabInfo', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer: ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setUsername(data.username);
                setPassword(data.password);
                setEmail(data.email);
            }
            else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error ' + error.message);
        }
    }

    useLayoutEffect(() => {
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
                value={ firstName }
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
                type="text"
                value={password}
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