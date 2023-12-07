import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  
  const [notification, setNotification] = useState('');

  const handleInput = e => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = Validation(values);
    setErrors(err);

    if (err.email === '' && err.password === '') {
      try {
        const response = await axios.post('http://localhost:8081/login', values,  { withCredentials: true });
        const { token, user } = response.data;

         localStorage.setItem('token', token);

         console.log('Authentication succeeded:', user);

        // Redirect to home page
        navigate('/profile');
      } catch (error) {
        console.error('Authentication failed:', error.response?.data || error.message);

        if (error.response && error.response.status === 404) {
          setNotification('User is not registered. Create an account to use the app.');
        } else {
          setErrors({ email: 'Invalid email or password', password: 'Invalid email or password' });
        }
      }
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded'>
        <h2>Log in</h2>
        {notification && (
          <div className='alert alert-warning' role='alert'>
            {notification}
          </div>
        )}
        <form action=""  onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label htmlFor="email"><strong>Username</strong></label>
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
        <button type="submit" onSubmit={handleSubmit} className='btn btn-success w-100 rounded-0'>Log In</button>
        
        <div className='d-flex justify-content-center align-items-center'>
            <p>No account yet?</p>
        </div>
        <Link to="/signup" className='btn btn-default bg-light w-100 rounded-0'>Create account</Link>
        
      </form>
    </div>
  </div>
  )
}

export default Login;