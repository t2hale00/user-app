import React from 'react'
import { Link } from 'react-router-dom';

function Home() {
  return (
      <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
        <div className='bg-white p-3 rounded w-25 '>
          <h2>Hello user!</h2>
            <Link to="/sendparcel" className='btn btn-default border-primary w-100 bg-light rounded-0'>Send Parcel</Link>
            <Link to="/notifications" className='btn btn-default border-primary w-100 bg-light rounded-0'>Notifications</Link>  
            <Link to="/accountsettings" className='btn btn-default border-primary w-100 bg-light rounded-0'>Account Settings</Link>
            <Link to="/logout" className='btn btn-default border-primary w-100 bg-light rounded-0'>Log Out</Link>
        </div>
      </div>
    )
}

export default Home;