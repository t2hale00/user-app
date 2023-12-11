import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

function SendParcel() {
  const [parcelInfo, setParcelInfo] = useState({
    size: {
      width: '',
      height: '',
      length: '',
      weight: '',
    },
    sender: {
      name: '',
      address: '',
      phoneNumber: '',
    },
    recipient: {
      name: '',
      address: '',
      phoneNumber: '',
    },
    location: '',
    reservationCode: '', 
    dateReserved: '',  // Include dateReserved in the state
  });

  const [notification, setNotification] = useState(null);

    // Add a new state to store the list of locations
  const [locations, setLocations] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Destructure parcelInfo for a cleaner payload
    const {
      size,
      sender,
      recipient,
      location,
      reservationCode,
      dateReserved,
    } = parcelInfo;

    // Your Axios post request here
    try {
      const response = await axios.post('http://localhost:8081/sendParcel', {
        width: size.width,
        height: size.height,
        length: size.length,
        weight: size.weight,
        senderName: sender.name,
        senderAddress: sender.address,
        senderPhoneNumber: sender.phoneNumber,
        recipientName: recipient.name,
        recipientAddress: recipient.address,
        recipientPhoneNumber: recipient.phoneNumber,
        location,
        reservationCode,
        dateReserved,
    }, {
        withCredentials: true,
      });

      if (response.status === 200) {
        // Clear the form
        setParcelInfo({
          size: {
            width: '',
            height: '',
            length: '',
            weight: '',
          },
          sender: {
            name: '',
            address: '',
            phoneNumber: '',
          },
          recipient: {
            name: '',
            address: '',
            phoneNumber: '',
          },
          location: '',
          reservationCode: '',
          dateReserved: '',
        });

        // Show success notification
        setNotification(`You have successfully reserved a cabinet in ${location}. Check your previous transactions in the History page.`);

        console.log('Parcel Information sent successfully:', response.data);
        // Reset form or navigate to the next step
      } else {
        console.error('Failed to send Parcel Information');
      }
    } catch (error) {
      console.error('Error:', error);
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

  // Fetch locations when the component mounts
  useEffect(() => {
    fetchLocations();
  }, []);

  // Fetch locations function
  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:8081/locations');
      console.log('Locations:', response.data);
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };
  
function handleLocationSelect(selectedLocationId) {
    // Clear existing notification
    setNotification(null);

    console.log('Selected Location ID:', selectedLocationId);
    console.log('Locations:', locations);
  
    // Find the selected location by matching locationid
    const selectedLocation = locations.find((location) => String(location.locationid) === String(selectedLocationId));

    // Check if selectedLocation is undefined
    if (!selectedLocation) {
      console.error(`Location with id ${selectedLocationId} not found.`);
      return;
    }
  
    console.log('Selected Location:', selectedLocation);
  
    const locationName = selectedLocation ? selectedLocation.locationname || '' : '';
    const reservationCode = generateReservationCode(locationName);
  
    setParcelInfo((prevParcelInfo) => ({
      ...prevParcelInfo,
      location: locationName,
      reservationCode,
      dateReserved: new Date().toISOString().slice(0, 19).replace("T", " "),
    }));

    // Reserve a cabinet for the selected location
    reserveCabinet(selectedLocationId, reservationCode);
  }
  
  function generateReservationCode(location) {
    // Generate a random 4-digit number
    const fourDigitCode = Math.floor(1000 + Math.random() * 9000);
    return fourDigitCode.toString();
  }

  // Updated function to reserve a cabinet
const reserveCabinet = async (Locationid, reservationCode) => {
  try {
    const response = await axios.post('http://localhost:8081/reserveCabinet', {
      Locationid,
    });

    if (response.status === 200) {
      const reservedCabinet = response.data.reservedCabinet;
      console.log(`Cabinet reserved successfully for location ${Locationid}:`, reservedCabinet);

      // Extract cabinetID from the reservedCabinet
      const cabinetID = reservedCabinet.cabinetID;

      // Now you can use the cabinetID in your additional logic or other functions
      // For example, you may want to send the reservationCode to the cabinets table
      await sendReservationCode(reservationCode, cabinetID);

    } else {
      console.error('Failed to reserve cabinet');
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      // No available cabinets for location
      setNotification("There are no available cabinets in this location");

      console.log(`No available cabinets for location ${Locationid}`);
    } else {
      console.error('Error:', error);
    }
  }
};

// Additional function to send reservationCode to cabinets table
const sendReservationCode = async (reservationCode, cabinetID) => {
  try {
    const response = await axios.post('http://localhost:8081/sendReservationCode', {
      reservationCode,
      reservedCabinet: { cabinetID },  // Send the reservedCabinet object with cabinetID
    });

    if (response.status === 200) {
      console.log('ReservationCode sent to cabinets table successfully:', response.data);
    } else {
      console.error('Failed to send ReservationCode to cabinets table');
    }
  } catch (error) {
    console.error('Error:', error);
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
            <Dropdown.Item as={Link} to="/notifications">Notifications</Dropdown.Item>
            <Dropdown.Item as={Link} to="/deleteaccount">Delete Account</Dropdown.Item>
            <Dropdown.Item as={Link} to="/logout">Logout</Dropdown.Item>
            {/* Add more items for other pages as needed */}
            </Dropdown.Menu>
      </Dropdown>
      </div>

       {/* Success Notification */}
       {notification && <Alert variant="success">{notification}</Alert>}

      <div className='p-3 rounded' style={{ color: 'white', borderColor: 'lightblue', borderWidth: '5px', borderStyle: 'solid', width: '300px', textAlign: 'center', marginBottom: '30px' }}>
        <h1>Send Parcel</h1>
      </div>
      
      <div className='bg-white p-3 rounded '>
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
            onChange={(e) => handleInputChange('size', 'length', e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formSizeMass">
          <Form.Label>Weight</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter weight in kg"
            value={parcelInfo.size.mass}
            onChange={(e) => handleInputChange('size', 'weight', e.target.value)}
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

        <h3>Delivery Location</h3>
              <Form.Group controlId="formLocation">
                <Form.Label>Select location</Form.Label>
                <Dropdown onSelect={(selectedLocationId) => handleLocationSelect(selectedLocationId)}>
                 <Dropdown.Toggle variant="secondary" id="dropdown-location">
                    {parcelInfo.location ? parcelInfo.location : 'Select location'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {locations.map((location) => (
                      <Dropdown.Item key={location.locationid} eventKey={location.locationid}>
                        {location.locationname}
                      </Dropdown.Item>
                    ))}
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
      {/* Success Notification */}
      {notification && <Alert variant="success">{notification}</Alert>}

    </div>
    </div>
  );
}

export default SendParcel;