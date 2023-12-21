import React, {useState} from 'react'
import { logoIcon } from "../assets/index";
import { Link } from 'react-router-dom';
import "../styles/navbar.css";
import { useNavigate } from 'react-router-dom';

export default function NavBar() {

    const navigate = useNavigate()
    const [userId, setUserId] = useState(() => {
        const storedUserId = sessionStorage.getItem('userId');
        return storedUserId || null; 
      });
      const handleSignOut = (e) => {
        sessionStorage.removeItem('userId');
        setUserId(null);
      };
      const handleSignIn = (e) => {
        navigate('/signin')
      };
    
    return (
        <div className='navbar'>
            <div>
                <Link to="/">
                    <img src={logoIcon} alt="" />
                </Link>
                <Link to="/" className='nav_about'>
                    About Us
                </Link>
                <Link to="/">
                    Contact Us
                </Link>


            </div>
            <div className='job_nav_left'>
                {/* <div className='flag'>
                    <img src={flagIcon} />
                    <select>
                        <option>English</option>
                    </select>
                </div> */}
                <Link>
                    Submit resume
                </Link>
                <Link to='/post'>
                    <button className='signin submit_job_btn'>Submit job</button>
                </Link>
                <button className='signin' onClick={userId ? handleSignOut : handleSignIn}>
                {userId ? 'Sign Out' : 'Sign In'}
                    </button>
            </div>
        </div>
    )
}
