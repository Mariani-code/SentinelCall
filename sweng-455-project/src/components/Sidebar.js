import { Link } from 'react-router-dom';
import './Sidebar.css';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Sidebar() {

    const navigate = useNavigate();
    const [showText, setShowText] = useState(false);

    const fetchRole = async () => {
        try {
            const token = localStorage.getItem('token');

            if (token === null) {
                throw new Error('Not logged in');
            }

            const response = await fetch('http://localhost:1000/checkRole', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setShowText(true);
            }
            else {
                if (response.status === 401) {
                    setShowText(false);
                }
                else {
                    throw new Error();
                }
            }
        }
        catch (error) {
            localStorage.removeItem('token');
            navigate('/login');
            console.log('Error: ' + error.message);
        }
    };

    useEffect(() => {
        fetchRole();
    }, []);

    return (
        <aside className="sidebar">
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/meetings">My Meetings</Link></li>
                <li><Link to="/rooms">Rooms</Link></li>
                <li><Link to="/complaints">Complaints</Link></li>
                {showText && <li><Link to="/admin">Admin</Link></li>}
                <li><Link to="/create-meeting">Create Meeting</Link></li>
            </ul>
        </aside>
    );
}