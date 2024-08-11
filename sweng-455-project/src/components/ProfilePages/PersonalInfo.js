
import './SharedProfile.css';

import { useState, useEffect } from 'react';

function PersonalInfo() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCopy, setPasswordCopy] = useState('');
    const [email, setEmail] = useState('');

    const [message, setMessage] = useState('');

    /*
        Copy of data from the fetch request
        Used to check if new data is different from base
    */
    const [updatedFirst, setUpFirst] = useState('');
    const [updatedLast, setUpLast] = useState('');
    const [updatedUser, setUpUser] = useState('');
    const [updatedPass, setUpPass] = useState('');
    const [updatedEmail, setUpEmail] = useState('');

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validatePassword(password, passwordCopy) {

        if (password !== passwordCopy) {
            throw new Error('Passwords do not match');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        var regex = /.*[A-Z].*[A-Z].*/
        if (!regex.test(password)) {
            throw new Error('Password does not contain two uppercase letters');
        }

        regex = /.*[a-z].*[a-z].*/
        if (!regex.test(password)) {
            throw new Error('Password does not contain two lowercase letters');
        }

        regex = /.*[0-9].*[0-9].*/
        if (!regex.test(password)) {
            throw new Error('Password does not contain two numbers');
        }

    }

    const hasNoSpaces = (str) => !/\s/.test(str);

    const grabUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:1000/grabAccountInfo', {
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

                setUpFirst(data.userI.firstName);
                setUpLast(data.userI.lastName);
                setUpUser(data.user.username);
                setUpPass(data.user.password);
                setUpEmail(data.user.email);
            }
            else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error ' + error.message);
        }
    }

    const handleUpdate = async () => {
        try {
            if (updatedFirst !== firstName) {
                if (!hasNoSpaces(firstName)) {
                    throw new Error('First Name must contain no spaces');
                }
            }

            if (updatedLast !== lastName) {
                if (!hasNoSpaces(lastName)) {
                    throw new Error('Last Name must contain no spaces');
                }
            }

            if (updatedUser !== username) {
                if (!hasNoSpaces(username)) {
                    throw new Error('Username must contain no spaces');
                }
            }

            if (updatedEmail !== email) {
                if (!validateEmail(email)) {
                    throw new Error('Email must be valid');
                }
            }

            if (updatedPass !== password) {
                validatePassword(password, passwordCopy);
            }

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:1000/updateAccountInfo', {
                method: 'POST',
                headers: {
                    'Content-type': `application/json`,
                    'Authorization': `Bearer: ${token}`
                },
                body: JSON.stringify({ firstName, lastName, username, password, email })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            grabUserInfo();
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
                onChange={(e) => setFirstName(e.target.value)}
            />
            <h2>
                Last Name
            </h2>
            <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <h2>
                Username
            </h2>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <h2>
                Password
            </h2>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <h2>
                Confirm Password
            </h2>
            <input
                type="password"
                value={passwordCopy}
                onChange={(e) => setPasswordCopy(e.target.value)}
            />
            <h2>
                Email
            </h2>
            <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleUpdate}>
                Update
            </button>
        </div>
    );
}

export default PersonalInfo;