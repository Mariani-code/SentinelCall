import './Profile.css';
import { useState } from 'react';

import PersonalInfo from './ProfilePages/PersonalInfo';
import BillingInfo from './ProfilePages/BillingInfo';

import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

function Profile() {

    const [activeButton, setActiveButton] = useState(0);

    return (
        <div className='main-container'>
            <Navbar />
            <Sidebar />
            <div className="profile-container">
                <div className="leftbox">
                    <nav>
                        <button className={`nav-button ${activeButton === 0 ? 'active' : ''}`} onClick={() => setActiveButton(0)}>Account</button>
                        <button className={`nav-button ${activeButton === 1 ? 'active' : ''}`} onClick={() => setActiveButton(1)}>Billing</button>
                    </nav>
                </div>
                <div className="rightbox">
                    {activeButton === 0 && <PersonalInfo />}
                    {activeButton === 1 && <BillingInfo />}
                </div>
            </div>
        </div>
    );

}

export default Profile;