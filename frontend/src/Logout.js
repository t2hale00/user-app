import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spinner, Alert } from 'react-bootstrap';

function Logout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        console.log('Attempting logout...');
        // Make a request to the server to log out
        await axios.get('http://localhost:8081/logout');

        // Simulate a delay for demonstration purposes (remove this line in production)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Set the notification message
        setNotification('Logged out successfully. Thank you for using the app.');

        console.log('Logout successful');
        // Delay redirect to give time for the user to see the notification
        setTimeout(() => {
          console.log('Redirecting...');
          navigate('/');
        }, 2000);
      } catch (error) {
        console.error('Logout error:', error);
        setLoading(false); // Set loading to false even if an error occurs
      }
    };

    // Call the logout function when the component mounts
    handleLogout();
  }, [navigate]);

  return (  
    <div className="text-center mt-5">
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          <p>Logging out...</p>
        </>
      )}
      {notification && <Alert variant="success">{notification}</Alert>}
    </div>
  );

}


export default Logout;

