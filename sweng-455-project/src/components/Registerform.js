import { useState } from 'react';

import './Registerform.css';

const Registerform = () => {
    const [email, setEmail] = useState('');
    // const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCopy, setPasswordCopy] = useState('');
    const [message, setMessage] = useState('');

    /*
        This checks for a valid email... somehow
    */
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    function validatePassword(password, passwordCopy) {

        if (password !== passwordCopy) {
            setMessage('Passwords do not match');
            return false;
        }

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters');
            return false;
        }

        var regex = /.*[A-Z].*[A-Z].*/
        if (!regex.test(password)) {
            setMessage('Password does not contain two uppercase letters');
            return false;
        }

        regex = /.*[a-z].*[a-z].*/
        if (!regex.test(password)) {
            setMessage('Password does not contain two lowercase letters');
            return false;
        }

        regex = /.*[0-9].*[0-9].*/
        if (!regex.test(password)) {
            setMessage('Password does not contain two numbers');
            return false;
        }

        return true;
    }

    const hasNoSpaces = (str) => !/\s/.test(str);

    const createAccount = async () => {

        if (!validateEmail(email)) {
            setMessage('Invalid email');
            return;
        }

        if (!validatePassword(password, passwordCopy)) {
            return;
        }

        try {
            const response = await fetch('http://localhost:1000/createAccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstName, lastName, email, password})
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
            }
        }
        catch (error) {
            setMessage('Error: ' + error.message);
        }
    }

    return (
        <div className="register-form">
            <input
                type="text"
                placeholder="Company Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Re-enter Password"
                value={passwordCopy}
                onChange={(e) => setPasswordCopy(e.target.value)}
            />
            <ul>
                <li>Password must be 6 characters long</li>
                <li>Password must at least contain 2 numbers</li>
                <li>Password must at least contain 2 uppercase letters</li>
                <li>Password must at least contain 2 lowercase letters</li>
            </ul>
            <button onClick={createAccount}>Register Account</button>
            {message && <p className={message.startsWith('Error') ? 'error-message' : 'success-message'}>{message}</p>}
        </div>
    );
}

export default Registerform;