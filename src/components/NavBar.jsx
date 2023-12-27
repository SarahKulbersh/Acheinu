import React, { useState } from 'react'
import { logoIcon, navClose, navIcon } from "../assets/index";
import { Link } from 'react-router-dom';
import "../styles/navbar.css";
import { useNavigate } from 'react-router-dom';

export default function NavBar() {

  const navigate = useNavigate()
  const [isNav, setNav] = useState(false);
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
    <div className='navigation_bar' style={{
      height: (isNav && (window.innerWidth < 758)) ? "100%" : "80px",
      backgroundColor: !isNav ? "white" : "rgba(0, 0, 0, 0.452)"
    }}>
      <div className='nav_bar'>
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
        <Link to='/post'>
          <button className='signin submit_job_btn'>Submit job</button>
        </Link>
        <button className='signin' onClick={userId ? handleSignOut : handleSignIn}>
          {userId ? 'Sign Out' : 'Sign In'}
        </button>
      </div>

      <div className='mob_nav'>
      <Link to="/" className='mob_nav_logo'>
          <img src={logoIcon} alt="" />
        </Link>
        <img src={!isNav ? navIcon : navClose} alt="" className='nav_icon' onClick={() => setNav(c => !c)} />
        {isNav && <> <div className='mob_nav_left'>
          <Link to='/post'>
            <button className='signin submit_job_btn'>Submit job</button>
          </Link>
          <button className='signin' onClick={userId ? handleSignOut : handleSignIn}>
            {userId ? 'Sign Out' : 'Sign In'}
          </button>
        </div>
          <div className='mob_nav_bar'>
            <Link to="/" className='nav_about'>
              About Us
            </Link>
            <Link to="/">
              Contact Us
            </Link>
          </div></>}
      </div>

    </div>
  )
}
