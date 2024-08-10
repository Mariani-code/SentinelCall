import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:1000/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                localStorage.removeItem('token');
                navigate('/login');
            }
            else {
                navigate('/login');
            }
        }
        catch (error) {
            navigate('/login');
            console.log('Error: ' + error.message);
        }
    }
    
    return (
        <nav className="navbar">
            <h1>SentinelCall</h1>
            <div className="nav-links">
                <Link to="/profile">Profile</Link>
                <Link to="/logout" onClick={handleLogout}>Logout</Link>
            </div>
        </nav>
    );
}