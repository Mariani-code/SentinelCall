import React from 'react';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>PennStateSoft MSS</h1>
        <div className="nav-links">
          <a href="#profile">Profile</a>
          <a href="#logout">Logout</a>
        </div>
      </nav>
      <div className="dashboard-content">
        <aside className="sidebar">
          <ul>
            <li><a href="#meetings">Meetings</a></li>
            <li><a href="#rooms">Rooms</a></li>
            <li><a href="#complaints">Complaints</a></li>
            <li><a href="#admin">Admin</a></li>
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
