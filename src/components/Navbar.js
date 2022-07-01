import React, { useEffect } from 'react';
// import { useLocation, useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux/es/exports';
import { useState } from 'react';

const Navbar = (props) => {

  const imgData = useSelector(state => state.imgData);

  let history = useHistory();
  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/log');
    document.location.reload();
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/#">Navbar</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-Link active" aria-current="page" to="/#">Home</Link>
            </li>
            <img id='profileImg' src={imgData} alt="" />
            <li className="nav-item dropdown">
              <Link className="nav-Link dropdown-toggle" to="/#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown
              </Link>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><Link className="dropdown-item" to="/#">Action</Link></li>
                <li><Link className="dropdown-item" to="/#">Another action</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/#">Something else here</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-Link disabled">Disabled</Link>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <a className="btn btn-primary" href="/mynote">My Note</a>
          </form>
        </div>
      </div>
      {!localStorage.getItem('token') ? <form className="d-flex">
        <a className="btn btn-primary mx-2" href="/log" role="button">Login</a>
        <a className="btn btn-primary mx-2" href="/signup" role="button">Signup</a>
      </form> : <button className='btn btn-primary' onClick={handleLogout}>Logout</button>}
    </nav>
  )
}

export default Navbar;
