import './SharedProfile.css';
import { useState, useLayoutEffect } from 'react';

function BillingInfo() {

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
            />
            <h2>
                Billing Address
            </h2>
            <input
                type="text"
            />
            <h2>
                Country
            </h2>
            <input
                type="text"
            />
            <h2>
                City
            </h2>
            <input
                type="text"
            />
            <h2>
                State
            </h2>
            <input
                type="text"
            />
            <button>
                Update
            </button>
        </div>
    );
}

export default BillingInfo;