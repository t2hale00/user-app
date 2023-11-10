import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';


function Login() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  const handleInput = e => {
    const {name, value} = e.target;
    setValues({
      ...values,
      [name]: value
    })
  }

  const handleSubmit = e => {
    e.preventDefault();
    setErrors(Validation(values));

    if(errors.email === "" && errors.password === ""){
      axios
      .post('http://localhost:8081/', values)
      .then(res => {
        console.log(res.data);
        navigate('/home');
        })
        .catch(err => {
          setLoginError('Invalid credentials');
          console.log(err);
      });
      }
    }

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <h2>Log In</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="email"><strong>Email</strong></label>
            <input 
              type="email" 
              className='form-control rounded-0' 
              placeholder=' Enter email' 
              name='email' 
              onChange={handleInput}
            />
            {errors.email &&  <span className='text-danger'>{errors.email}</span>}
          </div>

          <div className='mb-3'>
            <label htmlFor="password"><strong>Password</strong></label>
            <input 
              type="password" 
              className='form-control rounded-0' 
              placeholder=' Enter password' 
              name='password'
              onChange={handleInput}
            />
            {errors.password &&  <span className='text-danger'>{errors.password}</span>}
          </div>

          <button type='submit' onSubmit={handleSubmit} className='btn btn-success w-100 rounded-0'>Log in</button>
          {loginError && <div className='text-danger'>{loginError}</div>}
          <div className='d-flex justify-content-center align-items-center'>
            <p>No account yet?</p>
          </div>

          <Link to="/signup" className='btn btn-default border w-100 bg-light rounded-0'>Create Account</Link>
        </form>
      </div>
    </div>
  )
}

export default Login;