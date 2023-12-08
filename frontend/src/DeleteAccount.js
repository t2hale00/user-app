import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

const DeleteAccountButton = () => {
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');

  const handleDeleteAccount = async () => {
    try {
      // Replace with your server URL
      const response = await fetch('http://localhost:8081/deleteaccount', {
        method: 'DELETE',
        credentials: 'include',  // Add this line to include cookies in the request
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // If response is successful, redirect to the signup page
        setNotification('Account deleted successfully');
        console.log ('Account deleted successfully.');
        window.location.href = '/signup';
      } else {
        // If response is not successful, handle the error
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          // If the response is JSON, parse and display the error
          const data = await response.json();
          setError(data.error);
        } else {
          // If the response is not JSON, treat it as text
          const errorText = await response.text();
          console.error('Error deleting account:', errorText);
          setError('Error deleting account. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Error deleting account. Please try again.');
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>  
      <div className='bg-white p-3 rounded'>
      <Dropdown className="mb-3">
            <Dropdown.Toggle variant="secondary" id="dropdown-navigation" >
            Navigate to
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {/* Define routes for other pages using Link */}
            <Dropdown.Item as={Link} to="/profile">Home</Dropdown.Item>
            <Dropdown.Item as={Link} to="/sendparcel">Send Parcel</Dropdown.Item>
            <Dropdown.Item as={Link} to="/History">History</Dropdown.Item>
            <Dropdown.Item as={Link} to="/logout">Logout</Dropdown.Item>
            {/* Add more items for other pages as needed */}
            </Dropdown.Menu>
        </Dropdown>
        <div className='d-flex justify-content-center align-items-center'>
            <p>Are you sure you want to delete you account?</p>
        </div>
        <button type="submit" className='btn btn-danger w-100 rounded-0' onClick={handleDeleteAccount}>Delete Account</button>
        {notification && <p>{notification}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <br></br>
        <div className='d-flex justify-content-center align-items-center'>
            <p>You can also opt to Logging out instead of Deleting your account.</p>
        </div>
        <Link to="/logout" style={{ color: 'blue' }} className='btn btn-default bg-light w-100 rounded-0'>Log Out</Link>
        
    </div>
    </div>
  );
};

export default DeleteAccountButton;
