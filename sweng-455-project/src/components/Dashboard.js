import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>PennStateSoft MSS</h1>
        <div className="nav-links">
          <Link to="/profile">Profile</Link>
          <Link to="/logout">Logout</Link>
        </div>
      </nav>
      <div className="dashboard-content">
        <aside className="sidebar">
          <ul>
            <li><Link to="/meetings">My Meetings</Link></li>
            <li><Link to="/rooms">Rooms</Link></li>
            <li><Link to="/complaints">Complaints</Link></li>
            <li><Link to="/admin">Admin</Link></li>
          </ul>
        </aside>
        <main className="main-content">
          <h2>Welcome to the Meeting Scheduling System</h2>
          <p>Select an option from the sidebar to get started.</p>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
