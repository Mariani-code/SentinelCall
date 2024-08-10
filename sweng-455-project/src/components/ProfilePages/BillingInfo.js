import './SharedProfile.css';
import { useState, useLayoutEffect } from 'react';

function BillingInfo() {

    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [message, setMessage] = useState('');

    const grabUserInfo = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:1000/grabBillingInfo', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer: ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setPhone(data.user.phone);
                setAddress(data.user.address);
                setCountry(data.user.country);
                setCity(data.user.city);
                setState(data.user.state);
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
                Billing Info
            </h1>
            {message && <p className={message.startsWith('Error') ? 'error-message' : 'success-message'}>{message}</p>}
            <h2>
                Phone
            </h2>
            <input
                type="text"
                value={phone}
            />
            <h2>
                Billing Address
            </h2>
            <input
                type="text"
                value={address}
            />
            <h2>
                Country
            </h2>
            <input
                type="text"
                value={country}
            />
            <h2>
                City
            </h2>
            <input
                type="text"
                value={city}
            />
            <h2>
                State/Province
            </h2>
            <input
                type="text"
                value={state}
            />
            <button>
                Update
            </button>
        </div>
    );
}

export default BillingInfo;