import React, { useState } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { GeoAltFill } from 'react-bootstrap-icons';

function SendParcel() {
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
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log('Parcel Information:', parcelInfo);
    // Reset form or navigate to the next step
  }

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded w-25'>
      <h1>Send Parcel</h1>
      <Form onSubmit={handleSubmit}>
        {/* Parcel Size */}
        <Form.Group controlId="formSizeWidth">
          <Form.Label>Width</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter width"
            value={parcelInfo.size.width}
            onChange={(e) => handleInputChange('size', 'width', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formSizeHeight">
          <Form.Label>Height</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter height"
            value={parcelInfo.size.height}
            onChange={(e) => handleInputChange('size', 'height', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formSizeDepth">
          <Form.Label>Depth</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter depth"
            value={parcelInfo.size.depth}
            onChange={(e) => handleInputChange('size', 'depth', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formSizeMass">
          <Form.Label>Mass</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter mass"
            value={parcelInfo.size.mass}
            onChange={(e) => handleInputChange('size', 'mass', e.target.value)}
            required
          />
        </Form.Group>

        {/* Recipient Information */}
        {/* ... Repeat the structure for recipient and sender information ... */}

        {/* Delivery Location Dropdown */}
        <Form.Group controlId="formLocation">
          <Form.Label>Delivery Location</Form.Label>
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
