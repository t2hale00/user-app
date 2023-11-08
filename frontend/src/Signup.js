import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import Validation from './SignupValidation';

function Signup() {
    const [values, setValues] = useState({
        email: '',
        password: ''
      })
    
      const [errors, setErrors] = useState({})
    
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
        const err = Validation(values);
        setErrors(err);
        if(err.name === "" && err.email === "" && err.password === ""){
            
      }

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
    <div className='bg-white p-3 rounded w-25'>
      <h2>Sign up</h2>
      <form action=""  onSubmit={handleSubmit}>
      <div className='mb-3'>
          <label htmlFor="email"><strong>Name</strong></label>
          <input type="name" className='form-control rounded-0' placeholder=' Enter name' name='name' 
           onChange={handleInput}/>
           {errors.name &&  <span className='text-danger'>{errors.name}</span>}
        </div>
        <div className='mb-3'>
          <label htmlFor="email"><strong>Email</strong></label>
          <input type="email" className='form-control rounded-0' placeholder=' Enter email' name='email'
          onChange={handleInput}/>
          {errors.email &&  <span className='text-danger'>{errors.email}</span>}
        </div>
        <div className='mb-3'>
          <label htmlFor="password"><strong>Password</strong></label>
          <input type="password" className='form-control rounded-0' placeholder=' Enter password' name='password'
           onChange={handleInput}/>
           {errors.password &&  <span className='text-danger'>{errors.password}</span>}
        </div>
        <button className='btn btn-success w-100 rounded-0'>Create Account</button>
        
        <div className='d-flex justify-content-center align-items-center'>
            <p>Already have an account?</p>
        </div>
        <Link to="/" className='btn btn-default bg-light w-100 rounded-0'>Log in</Link>
        
      </form>
    </div>
  </div>
  )
}

export default Signup;