import { Navbar } from './Navbar.js';
import { Sidebar } from './Sidebar.js';

import React, { useState, useEffect } from 'react';

import './Complaints.css';

function Complaints() {

    const [complaints, setComplaints] = useState([]);
    const [error, setError] = useState('');
    const [showText, setShowText] = useState(false);
    const [addingComplaint, setAddingComplaint] = useState(false);
    const [complaintString, setComplaintString] = useState("");

    // Function to fetch complaints from the server
    const fetchComplaints = async () => {
        try {
            const response = await fetch('http://localhost:1000/complaints', {
                method: 'GET',
            });
            const data = await response.json();
            if (response.ok) {
                setComplaints(data);
            } else {
                setError('Failed to fetch complaints');
            }
        } catch (err) {
            setError('Error: ' + err.message);
        }
    };

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
            console.log('Error: ' + error.message);
        }
    };

    useEffect(() => {
        fetchRole();
        fetchComplaints();
    }, []);

    const handleAddComplaints = async (complaintID) => {
        try {
            const token = localStorage.getItem('token');

            if (token === null) {
                throw new Error('Not logged in');
            }

            const response = await fetch('http://localhost:1000/addComplaint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ complaintID, complaintString })
            });
            if (!response.ok) {

                throw new Error('Something has gone wrong');
            }
        }
        catch (error) {
            console.log('Error: ' + error.message);
        }
        fetchComplaints();
        switchToAdd();
    }

    const switchToAdd = () => {
        setAddingComplaint(!addingComplaint);
    }

    const handleResolveComplaints = async (complaintID) => {
        try {
            const token = localStorage.getItem('token');

            if (token === null) {
                throw new Error('Not logged in');
            }

            const response = await fetch('http://localhost:1000/resolveComplaint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ complaintID })
            });

            if (!response.ok) {
                throw new Error('Something has gone wrong');
            }
        }
        catch (error) {
            console.log('Error: ' + error.message);
        }
        fetchComplaints();
    }

    return (
        <div className='nav-container'>
            <Navbar />
            <div className='nav-content'>
                <Sidebar />
                {!addingComplaint &&
                    <div className="complaints-container">
                        <h2> Complaints </h2>
                        {!showText && <button onClick={() => switchToAdd()} className="complaints-add-button">
                            Add Complaint
                        </button>}
                        {error && <p className="error-message">{error}</p>}
                        <div className="complaints-list">
                            {complaints.length > 0 ? (
                                complaints.map(complaint => (
                                    <div key={complaint.id} className="complaints-card">
                                        <h3 className="complaints-name">Complaint from: {complaint.user}</h3>
                                        <p className="complaints-room">{complaint.complaint}</p>
                                        {showText && <button onClick={() => handleResolveComplaints(complaint.id)} className="manage-participants-button remove-participants-button">
                                            Resolve Complaint
                                        </button>}
                                    </div>
                                ))
                            ) : (
                                <p></p>
                            )}
                        </div>
                    </div>
                }

                {addingComplaint &&
                    <div className="complaints-add-container">
                        <h2>Adding Complaint</h2>
                        <textarea type="text" onChange={(e) => setComplaintString(e.target.value)} />
                        <br />
                        <button onClick={() => handleAddComplaints(complaints.length)} className="manage-participants-button add-participants-button">
                            Confirm Add
                        </button>
                    </div>
                }
            </div>
        </div>
    );

}

export default Complaints;