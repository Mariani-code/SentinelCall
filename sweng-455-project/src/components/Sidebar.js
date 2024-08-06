import { Link } from 'react-router-dom';
import './Sidebar.css';

import { useEffect, useState } from 'react';

export function Sidebar() {

    const [showText, setShowText] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch('http://localhost:1000/checkRole', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                setShowText(true);
            }
            else {
                setShowText(false);
            }
        });
        
    },[token]);

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