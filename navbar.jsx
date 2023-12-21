import React from 'react'

export function Navbar() {
  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light">
      <div className="container-fluid">
        {/* <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="mynavbar"> */}

        <div className="navbar-header">
          <img src="logo.png" alt="Logo" width="30" height="30" className="d-inline-block align-top" />
        </div>

        <ul className="nav navbar-nav navbar-right">
          <li className="nav-item">
            <a className="nav-link" href="#">About Us</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Contact Us</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Submit Resume</a>
          </li>
          <li className="nav-item dropdown">
            <button className="btn btn-outline-dark dropdown-toggle" type="button" id="languageDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Language
            </button>
            <div className="dropdown-menu" aria-labelledby="languageDropdown" >
              <a className="dropdown-item" href="#">English</a>
              <a className="dropdown-item" href="#">Hebrew</a>
            </div>
          </li>
          <li className="nav-item" style={{ marginLeft: '10px' }}>
            <button className="btn btn-primary">Sign In</button>
          </li>


        </ul>
      </div>
      {/* </div> */}
    </nav>
  )
}
