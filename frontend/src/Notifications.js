import React from 'react';
import { Dropdown } from 'react-bootstrap'; // Import necessary components from your UI library
import { Link } from 'react-router-dom'; // Import Link component from React Router

function Notifications() {
  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded w-25 justify-content-center align-items-center'>
        {/* Navigation Dropdown */}
       <Dropdown className="mb-3">
            <Dropdown.Toggle variant="secondary" id="dropdown-navigation" >
            Navigate to
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {/* Define routes for other pages using Link */}
            <Dropdown.Item as={Link} to="/profile">Home</Dropdown.Item>
            <Dropdown.Item as={Link} to="/sendparcel">Send Parcel</Dropdown.Item>
            <Dropdown.Item as={Link} to="/History">History</Dropdown.Item>
            <Dropdown.Item as={Link} to="/deleteaccount">Delete Account</Dropdown.Item>
            <Dropdown.Item as={Link} to="/logout">Logout</Dropdown.Item>
            {/* Add more items for other pages as needed */}
            </Dropdown.Menu>
        </Dropdown>
        <h2>Notifications</h2>
        
    </div>
  </div>
  )
}

export default Notifications;