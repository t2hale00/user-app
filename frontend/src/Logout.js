import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from 'react-bootstrap'; // Import Spinner from react-bootstrap

function Logout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Make a request to the server to log out
        await axios.get('http://localhost:8081/logout');
        
        // Simulate a delay for demonstration purposes (remove this line in production)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Redirect to the login page or any other desired route
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        setLoading(false); // Set loading to false when the process is complete
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
        <p>Logging out...</p>
      )}
    </div>
  );
}

export default Logout;
