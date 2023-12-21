import React from 'react'
import { SearchBox } from './searchBox'
import { RecentlyPostedJobs } from './recentlyPostedJobs';
import { useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import "./styles/recent_jobs.css";

import "./styles/lookforwork.css"
import { workIcon } from './assets'

function LandingPage() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/jobsList/*');
  };
  return (
    <>
      <NavBar />
      <div className='supportbox'>
        <div className='letssupport'>Let’s support each other.</div>
        <div className='beaprt'>Be a part of the collaboration betweenAhcheinu Bnei Yisrael In Ertez Yisrael and the diaspora</div>
        <SearchBox/>
      </div>
            <RecentlyPostedJobs />

          <div className='look_work'>
            <div className='look_work_box'>
              <img src={workIcon} alt="" className='look_work_icon' />
              <div className='look_work_box_child'>
                <h2 className='look_work_desc'>Looking for Work? Acheinu Bnei Yisrael in Chutz La’aretz are looking to hire.</h2>
                <button className='look_work_btn' onClick={handleClick}>View available oppurtunities</button>
              </div>
            </div>
            <div className='look_work_box_child'>
              <h2 className='look_work_desc'>Employer? How can we help with your hiring needs</h2>
              <button className='look_work_btn'>View available oppurtunities</button>
            </div>
          </div>
      <Footer />
    </>
  )
}

export default LandingPage
