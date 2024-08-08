import React from 'react';
import logo from '../assets/logo.png';
import './Login.css';

import { useState } from 'react';

import Loginform from './Loginform.js';
import Registerform from './Registerform.js';

function Login() {

    const [loginState, setLoginState] = useState(true);
    const [loginText, setLoginText] = useState('#0000f0');
    const [registerText, setRegisterText] = useState('black');
    
    const handleChange = () => {
        setLoginState(!loginState);
        if (loginState) {
            setLoginText(loginText === 'black' ? '#0000f0' : 'black');
            setRegisterText(registerText === '#0000f0' ? 'black' : '#0000f0');
        }
        else {
            setLoginText(loginText === '#0000f0' ? 'black' : '#0000f0');
            setRegisterText(registerText === 'black' ? '#0000f0' : 'black');
        }
    };


    return (
        <div className="login-container">
            <div className="welcome-container">
                <img src={logo} alt="SentinelCall Logo" className="logo" />
                <h1>Welcome to SentinelCall</h1>
                <p>Your trusted meeting scheduling system.</p>
                <br></br>
                <div className="login-switch">
                    <span style={{color: loginText} }>Login</span>
                    <label className="switch">
                        <input type="checkbox" checked={!loginState} onChange={handleChange} />
                        <span className="slider round"></span>
                    </label>
                    <span style={{ color: registerText }}>Register</span>
                </div>
            </div>
            <div className="form-container">
                {loginState && <Loginform />}
                {!loginState && <Registerform />}
            </div>
        </div>
    );
}

export default Login;
