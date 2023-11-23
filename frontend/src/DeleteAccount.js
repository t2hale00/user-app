import React, { useState } from 'react';

const DeleteAccountButton = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleDeleteAccount = async () => {
    try {
      // Replace with your server URL
      const response = await fetch('http://localhost:3001/deleteaccount', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer YOUR_JWT_TOKEN', // Replace with the actual token
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Error deleting account. Please try again.');
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>  
      <div className='bg-white p-3 rounded w-25 '>
        <button type="submit" className='btn btn-danger w-100 rounded-0' onClick={handleDeleteAccount}>Delete Account</button>
        {message && <p>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    </div>
  );
};

export default DeleteAccountButton;
