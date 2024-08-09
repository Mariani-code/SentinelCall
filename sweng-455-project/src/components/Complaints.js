import { Navbar } from './Navbar.js';
import { Sidebar } from './Sidebar.js';

import React, { useState, useEffect } from 'react';

import './Complaints.css';

function Complaints() {

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