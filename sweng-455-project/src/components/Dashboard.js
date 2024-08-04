import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Navbar() {
  return (
    <nav className="navbar">
      <h1>SentinelCall</h1>
      <div className="nav-links">
        <Link to="/profile">Profile</Link>
        <Link to="/logout">Logout</Link>
      </div>
    </nav>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/meetings">My Meetings</Link></li>
        <li><Link to="/rooms">Rooms</Link></li>
        <li><Link to="/complaints">Complaints</Link></li>
        <li><Link to="/admin">Admin</Link></li>
        <li><Link to="/create-meeting">Create Meeting</Link></li>
      </ul>
    </aside>
  );
}

function Widget({ title, content }) {
  return (
    <div className="widget">
      <h3>{title}</h3>
      {content}
    </div>
  );
}

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <h2>Welcome to the Meeting Scheduling System</h2>
          <p>Select an option from the sidebar to get started.</p>
          <button className="create-meeting-button" onClick={() => window.location.href = '/create-meeting'}>
            Create a Meeting
          </button>
          <div className="widgets">
            <Widget 
              title="Today's Meetings" 
              content={
                <ul>
                  <li>10:00 AM - Project Kickoff Meeting</li>
                  <li>1:00 PM - Team Stand-up</li>
                  <li>3:00 PM - Client Review</li>
                </ul>
              }
            />
            <Widget 
              title="Room Availability" 
              content={
                <ul>
                  <li>Room 101: Available</li>
                  <li>Room 102: Reserved (12:00 PM - 2:00 PM)</li>
                  <li>Room 103: Available</li>
                </ul>
              }
            />
            <Widget 
              title="Action Items" 
              content={
                <ul>
                  <li>Complete meeting agenda for the client review.</li>
                  <li>Send out invitations for the project kickoff meeting.</li>
                  <li>Update room reservation for the team stand-up.</li>
                </ul>
              }
            />
            <Widget 
              title="Notifications" 
              content={
                <ul>
                  <li>New meeting request received from John Doe.</li>
                  <li>Room 102 reservation updated.</li>
                  <li>Your complaint regarding room 101 has been resolved.</li>
                </ul>
              }
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
