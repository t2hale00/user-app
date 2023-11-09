import React from 'react'
import { Link } from 'react-router-dom';

function Home() {
  return (
      <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
        <div className='bg-white p-3 rounded w-25'>
          <h2>Log In</h2>
          <form action="">
            <div className='mb-3'>
              <label htmlFor="email"><strong>Email</strong></label>
              <input type="email" className='form-control rounded-0' placeholder=' Enter email' name='email' />
             {errors.email &&  <span className='text-danger'>{errors.email}</span>}
            </div>
  
            <div className='mb-3'>
              <label htmlFor="password"><strong>Password</strong></label>
              <input type="password" className='form-control rounded-0' placeholder=' Enter password' name='password'/>
              {errors.password &&  <span className='text-danger'>{errors.password}</span>}
            </div>
  
            <button type='submit' className='btn btn-success w-100 rounded-0'>Send Parcel</button>
            
            <div className='d-flex justify-content-center align-items-center'>
              <p>No account yet?</p>
            </div>
  
            <Link to="/" className='btn btn-default border w-100 bg-light rounded-0'>Create Account</Link>
          </form>
        </div>
      </div>
    )
}

export default Home;