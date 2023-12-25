import React from 'react'
// import './styles/searchBox.css'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './styles/letssupport.css'
import { searchIcon } from './assets'

export function SearchBox() {

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()

  const handleSearch = async () => {
    if (searchTerm === "") {
      navigate(`/jobsList/*`);
    }
    else {
      navigate(`/jobsList/${searchTerm}`);

    }
  };

  return (
    <div className='searchbox'>
      <img src={searchIcon} />
      <input placeholder='Search for your next job' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></input>
      <button className='signin' onClick={handleSearch}>Search</button>
    </div>

  )
}