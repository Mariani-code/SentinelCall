

import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

import { useEffect, useState } from 'react';
import './Admin.css';

function Admin() {

    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:1000/users', {
                method: 'GET',
            });
            const data = await response.json();
            if (response.ok) {
                setUsers(data);
            } else {
                setError('Failed to fetch complaints');
            }
        } catch (err) {
            setError('Error: ' + err.message);
        }
    }

    const handleMakeAdmin = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:1000/makeAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': `application/json`,
                    'Authorization': `Bearer: ${token}`
                },
                body: { id }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
        } catch (err) {
            setError('Error: ' + err.message);
        }
    }

    const handleSuspend = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:1000/suspendAccount', {
                method: 'POST',
                headers: {
                    'Content-Type': `application/json`,
                    'Authorization': `Bearer: ${token}`
                },
                body: { id }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
        } catch (err) {
            setError('Error: ' + err.message);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className='nav-container'>
            <Navbar />
            <div className='nav-content'>
                <Sidebar />
                <div className="users-container">
                    <h2> User Management </h2>
                    {error && <p className="error-message">{error}</p>}
                    <div className="users-list">
                        {users.length > 0 ? (
                            users.map(user => (
                                <div key={user.id} className="users-card">
                                    <h3 className="users-name">User: {user.username}</h3>
                                    <button onClick={() => handleMakeAdmin(user.id)} className="manage-users-button add-participants-button">
                                        Add/Remove Admin
                                    </button>
                                    <button onClick={() => handleSuspend(user.id)} className="manage-users-button remove-participants-button">
                                        Suspend
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p></p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin;