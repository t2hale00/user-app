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
        <div className='d-flex flex-column justify-content-center align-items-center bg-primary'>
        {/* Navigation Dropdown */}
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
        </div>
        <div>
        <h1>Parcel History</h1>

        {error && <p>{error}</p>}

        <Row>
            {parcelHistory.map((parcel) => (
            <Col key={parcel.parcelId} xs={12} md={4}>
                <Card>
                <Card.Body>
                    <Card.Title>{`Parcel #${parcel.parcelId}`}</Card.Title>
                    <Card.Text>
                    <strong>Size:</strong> {`${parcel.width}cm x ${parcel.height}cm x ${parcel.length}cm`}
                    <br />
                    <strong>Weight:</strong> {`${parcel.weight}kg`}
                    <br />
                    <strong>Sender:</strong> {`${parcel.senderName}, ${parcel.senderAddress}, ${parcel.senderPhoneNumber}`}
                    <br />
                    <strong>Recipient:</strong> {`${parcel.recipientName}, ${parcel.recipientAddress}, ${parcel.recipientPhoneNumber}`}
                    <br />
                    <strong>Location:</strong> {parcel.location}
                    <br />
                    <strong>Reservation Code:</strong> {parcel.reservationCode}
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
