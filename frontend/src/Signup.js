import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Validation from './SignupValidation';
import axios from 'axios';

function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
      })
      
      const navigate = useNavigate();
    
      const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: ''
      })

      const [notification, setNotification] = useState(null);
    
      const handleInput = e => {
        const {name, value} = e.target;
        setValues({
          ...values,
          [name]: value
        })
      }
    
      const handleSubmit =  e => {
        e.preventDefault();
        const err = Validation(values);
        setErrors(err);

        if(errors.name === "" && errors.email === "" && errors.password === ""){
          axios.post('http://localhost:8081/signup', values)
          .then((res) => {
            setNotification('Account created successfully. Redirecting to Login page');
            // Navigate to login page after a short delay
            setTimeout(() => {
              navigate('/');
            }, 3000); })
          .catch((err) => {
            console.error(err);
            if (err.response && err.response.status === 409) {
              setNotification('Account already exists. Please login.');
            } else {
              setNotification('Error creating account. Please try again.');
            }
          });
      }
    };

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded'>
        <h2>Sign up</h2>
        <form action=""  onSubmit={handleSubmit}>
        {notification && <p className={notification.includes('successfully') ? 'text-success' : 'text-danger'}>{notification}</p>}
          
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
        <button type="submit" onSubmit={handleSubmit} className='btn btn-success w-100 rounded-0'>Create Account</button>
        
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