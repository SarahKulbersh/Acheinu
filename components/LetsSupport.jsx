import React from 'react'
import '../styles/letssupport.css'
import { searchIcon } from '../assets'

const LetsSupport = () => {
  return (
    <div className='supportbox'>
      <div className='letssupport'>Let’s support each other.</div>
      <div className='beaprt'>Be a part of the collaboration betweenAhcheinu Bnei Yisrael In Ertez Yisrael and the diaspora</div>
      <div className='searchbox'>
        <img src={searchIcon} />
        <input placeholder='Search'></input>
        <button className='signin'>Search</button>
      </div>
    </div>
  )
}

export default LetsSupport