import { Navbar } from './Navbar.js';
import { Sidebar } from './Sidebar.js';

import './Complaints.css';

function Complaints() {

    return (
        <div className='nav-container'>
            <Navbar />
            <div className='nav-content'>
                <Sidebar />
                <div className="complaints-container">
                    <h2> Complaints </h2>
                    <p>
                        There should be complaints here.
                    </p>
                </div>
            </div>
        </div>
    );

}

export default Complaints;