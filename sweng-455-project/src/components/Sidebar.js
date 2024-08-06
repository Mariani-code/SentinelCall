import { Link } from 'react-router-dom';
import './Sidebar.css';

import { useEffect, useState } from 'react';

export function Sidebar() {

    const [showText, setShowText] = useState(false);

    const isAdmin = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:1000/checkAuth', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setShowText(true);
            }
            else {
                setShowText(false);
            }
        }
        catch (error) {
            console.log('Error: ' + error.message);
        }
    }

    /* 
        Calls isAdmin() ONCE per load
        Should make Admin hidden if not on "admin" account
    */
    useEffect(() => {
        isAdmin();
    }, []);

    return (
        <aside className="sidebar">
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/meetings">My Meetings</Link></li>
                <li><Link to="/rooms">Rooms</Link></li>
                <li><Link to="/complaints">Complaints</Link></li>
                { showText && <li><Link to="/admin">Admin</Link></li>}
                <li><Link to="/create-meeting">Create Meeting</Link></li>
            </ul>
        </aside>
    );
}