import React from 'react'
import { Link } from 'react-router-dom';

function Home() {
  return (
      <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
        <div className='bg-white p-3 rounded w-25'>
          <h2>Log In</h2>
          <form action="">
            
  
            
  
            <button type='submit' className='btn btn-success w-100 rounded-0'>Send Parcel</button>
            
            <div className='d-flex justify-content-center align-items-center'>
              
            </div>
  
            <Link to="/" className='btn btn-default border w-100 bg-light rounded-0'>Create Account</Link>
          </form>
        </div>
      </div>
    )
}

export default Home;