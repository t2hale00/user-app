import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Dropdown } from 'react-bootstrap'; // Import necessary components from your UI library
import { Link } from 'react-router-dom'; // Import Link component from React Router
import axios from 'axios';

function History() {
  const [parcelHistory, setParcelHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch parcel history when the component mounts
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:8081/history', {
        withCredentials: true,
      });
      console.log('Response from /history:', response);
      setParcelHistory(response.data);
    } catch (error) {
      console.error('Error fetching parcel history:', error);
      setError('Error fetching parcel history');
    }
  };

  return (
    <div className='d-flex flex-column justify-content-center align-items-center bg-primary'>
         {/* Navigation Dropdown */}
        <Dropdown className="mb-3">
            <Dropdown.Toggle variant="secondary" id="dropdown-navigation" >
            Navigate to
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {/* Define routes for other pages using Link */}
            <Dropdown.Item key="home" as={Link} to="/profile">Home</Dropdown.Item>
            <Dropdown.Item key="sendParcel" as={Link} to="/sendparcel">Send Parcel</Dropdown.Item>
            <Dropdown.Item as={Link} to="/notifications">Notifications</Dropdown.Item>
            <Dropdown.Item key="deleteAccount" as={Link} to="/deleteaccount">Delete Account</Dropdown.Item>
            <Dropdown.Item key="logout" as={Link} to="/logout">Logout</Dropdown.Item>
            {/* Add more items for other pages as needed */}
            </Dropdown.Menu>
        </Dropdown>
        
        <div >
        <h1 className="text-center">Parcel History</h1>

        {error && <p>{error}</p>}

        <Row xs={1} md={2} lg={3} xl={4}>
            {parcelHistory.map((parcel) => (
            <Col key={parcel.parcelId} >
                <Card style={{ minWidth: '250px', marginBottom: '20px' }}>
                <Card.Body>
                    <Card.Title>{`Your Parcel `}</Card.Title>
                    <Card.Text>
                    <strong>Size:</strong> {`${parcel.width}cm x ${parcel.height}cm x ${parcel.length}cm`}
                    <br />
                    <strong>Weight:</strong> {`${parcel.weight}kg`}
                    <br />
                    <strong>Sender:</strong> {`${parcel.sendername}, ${parcel.senderaddress}, ${parcel.senderPhoneNumber}`}
                    <br />
                    <strong>Recipient:</strong> {`${parcel.recipientname}, ${parcel.recipientaddress}, ${parcel.recipientPhoneNumber}`}
                    <br />
                    <strong>Location:</strong> {parcel.location}
                    <br />
                    <strong>Cabinet Code:</strong> {parcel.reservationCode}
                    <br />
                    <strong>Reservation Date:</strong> {parcel.dateReserved}
                    <br />
                    <strong>Status:</strong> {parcel.status}
                    </Card.Text>
                </Card.Body>
                </Card>
            </Col>
            ))}
        </Row>
        </div>
    </div>
    
    
  );
}

export default History;
