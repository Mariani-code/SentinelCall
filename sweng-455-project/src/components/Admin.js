

import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

function Admin() {
    return (
        <div className='nav-container'>
            <Navbar />
            <div className='nav-content'>
                <Sidebar />
            </div>
        </div>
    )
}

export default Admin;