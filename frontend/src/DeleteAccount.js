import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

const DeleteAccountButton = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleDeleteAccount = async () => {
    try {
      // Replace with your server URL
      const response = await fetch('http://localhost:3001/deleteaccount', {
        method: 'DELETE',
        credentials: 'include',  // Add this line to include cookies in the request
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Error deleting account. Please try again.');
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>  
      <div className='bg-white p-3 rounded w-25 '>
      <Dropdown className="mb-3">
            <Dropdown.Toggle variant="secondary" id="dropdown-navigation" >
            Navigate to
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {/* Define routes for other pages using Link */}
            <Dropdown.Item as={Link} to="/profile">Home</Dropdown.Item>
            <Dropdown.Item as={Link} to="/History">History</Dropdown.Item>
            {/* Add more items for other pages as needed */}
            </Dropdown.Menu>
        </Dropdown>
        <button type="submit" className='btn btn-danger w-100 rounded-0' onClick={handleDeleteAccount}>Delete Account</button>
        {message && <p>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    </div>
  );
};

export default DeleteAccountButton;
