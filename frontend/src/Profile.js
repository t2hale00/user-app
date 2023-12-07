import React from 'react'
import { Link } from 'react-router-dom';

function Profile() {
  return (
      <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
        <div className='bg-white p-3 rounded '>
          <h2>Hello user!</h2>
            <Link to="/sendparcel" className='btn btn-default border-primary w-100 bg-light rounded-0'>Send Parcel</Link>
            <Link to="/history" className='btn btn-default border-primary w-100 bg-light rounded-0'>History</Link>  
            <Link to="/notifications" className='btn btn-default border-primary w-100 bg-light rounded-0'>Notifications</Link>  
            <Link to="/deleteaccount" className='btn btn-default border-primary w-100 bg-light rounded-0'><span style={{ color: 'red' }}>Delete Account</span></Link>
            <Link to="/logout" className='btn btn-default border-primary w-100 bg-light rounded-0'><span style={{ color: 'green' }}>Log Out</span></Link>
        </div>
      </div>
    )
}

export default Profile;