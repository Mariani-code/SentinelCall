import { Navbar } from './Navbar.js';
import { Sidebar } from './Sidebar.js';

import './Complaints.css';

function Complaints() {

    return (
        <div className='main-container'>
            <Navbar />
            <Sidebar />
            <div className="complaints-container">
                <h2> Complaints </h2>
                <p>
                    There should be complaints here.
                </p>
            </div>
        </div>
    );

}

export default Complaints;