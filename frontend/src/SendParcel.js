import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';
//import { GeoAltFill } from 'react-bootstrap-icons';

function SendParcel() {
  const [locations, setLocations] = useState([]);
  const [parcelInfo, setParcelInfo] = useState({
    size: {
      width: '',
      height: '',
      depth: '',
      mass: '',
    },
    recipient: {
      name: '',
      address: '',
      phoneNumber: '',
    },
    sender: {
      name: '',
      address: '',
      phoneNumber: '',
    },
    location: '',
    reservationCode: '',
  });

  useEffect(() => {
    // Fetch locations from the backend when the component mounts
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/locations'); // Assuming your backend API endpoint for locations
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  function handleInputChange(category, field, value) {
    setParcelInfo((prevParcelInfo) => ({
      ...prevParcelInfo,
      [category]: {
        ...prevParcelInfo[category],
        [field]: value,
      },
    }));
  }

  function handleLocationSelect(selectedLocation) {
    const reservationCode = generateReservationCode(selectedLocation);
    setParcelInfo((prevParcelInfo) => ({
      ...prevParcelInfo,
      location: selectedLocation,
      reservationCode,
    }));
  }

  function generateReservationCode(location) {
    // Generate a random 4-digit number
    const fourDigitCode = Math.floor(1000 + Math.random() * 9000);
    return fourDigitCode.toString();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Assuming you have a form with input fields and you want to collect their values
    const formData = new FormData(e.target);
    const parcelInfo = {};
    formData.forEach((value, key) => {
      parcelInfo[key] = value;
    });
  
    try {
      // Send parcelInfo to the backend API
      const response = await fetch('/sendParcel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parcelInfo),
      });
  
      if (response.ok) {
        console.log('Parcel Information sent successfully:', parcelInfo);
        // Reset form or navigate to the next step
      } else {
        console.error('Failed to send Parcel Information');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className='d-flex flex-column justify-content-center align-items-center bg-primary'>
      <div className='p-3 rounded w-25' style={{ color: 'white', borderColor: 'lightblue', borderWidth: '5px', borderStyle: 'solid', width: '300px', textAlign: 'center', marginBottom: '30px' }}>
        <h1>Send Parcel</h1>
      </div>
      <div className='bg-white p-3 rounded w-25 '>
        
        {/* Parcel Size */}
      <h1>Parcel Size</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formSizeWidth">
          <Form.Label>Width</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter width in cm"
            value={parcelInfo.size.width}
            onChange={(e) => handleInputChange('size', 'width', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formSizeHeight">
          <Form.Label>Height</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter height in cm"
            value={parcelInfo.size.height}
            onChange={(e) => handleInputChange('size', 'height', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formSizeDepth">
          <Form.Label>Length</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter lentgh in cm"
            value={parcelInfo.size.depth}
            onChange={(e) => handleInputChange('size', 'depth', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formSizeMass">
          <Form.Label>Mass</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter mass in kg"
            value={parcelInfo.size.mass}
            onChange={(e) => handleInputChange('size', 'mass', e.target.value)}
            required
          />
        </Form.Group>

        {/* Sender Information */}
        <h3>Sender Information</h3>
        <Form.Group controlId="formSenderName">
          <Form.Label>Sender Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter sender name"
            value={parcelInfo.sender.name}
            onChange={(e) => handleInputChange('sender', 'name', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formSenderAddress">
          <Form.Label>Sender Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter sender address"
            value={parcelInfo.sender.address}
            onChange={(e) => handleInputChange('sender', 'address', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formSenderPhoneNumber">
          <Form.Label>Sender Phone Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter sender phone number"
            value={parcelInfo.sender.phoneNumber}
            onChange={(e) => handleInputChange('sender', 'phoneNumber', e.target.value)}
            required
          />
        </Form.Group>

        {/* Recipient Information */}
        <h3>Recipient Information</h3>
        <Form.Group controlId="formRecipientName">
          <Form.Label>Recipient Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter recipient name"
            value={parcelInfo.recipient.name}
            onChange={(e) => handleInputChange('recipient', 'name', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formRecipientAddress">
          <Form.Label>Recipient Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter recipient address"
            value={parcelInfo.recipient.address}
            onChange={(e) => handleInputChange('recipient', 'address', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formRecipientPhoneNumber">
          <Form.Label>Recipient Phone Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter recipient phone number"
            value={parcelInfo.recipient.phoneNumber}
            onChange={(e) => handleInputChange('recipient', 'phoneNumber', e.target.value)}
            required
          />
        </Form.Group>

        {/* Delivery Location Dropdown */}
        <h3>Delivery Location</h3>
        <Form.Group controlId="formLocation">
          <Form.Label>Select location</Form.Label>
          <Dropdown onSelect={handleLocationSelect}>
            <Dropdown.Toggle variant="secondary" id="dropdown-location">
              {parcelInfo.location ? parcelInfo.location : 'Select Location'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="Location1">Location 1</Dropdown.Item>
              <Dropdown.Item eventKey="Location2">Location 2</Dropdown.Item>
              <Dropdown.Item eventKey="Location3">Location 3</Dropdown.Item>
              <Dropdown.Item eventKey="Location4">Location 4</Dropdown.Item>
              <Dropdown.Item eventKey="Location5">Location 5</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>

        {/* Reservation Code */}
        <Form.Group controlId="formReservationCode">
          <Form.Label>Reservation Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Reservation Code"
            value={parcelInfo.reservationCode}
            readOnly
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
    </div>
  );
}

export default SendParcel;
