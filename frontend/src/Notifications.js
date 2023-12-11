import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Axios from "axios";
import { Card, Col, Dropdown,Row } from "react-bootstrap";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch notifications when the component mounts
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await Axios.get("http://localhost:8081/notifications", {
        withCredentials: true,
      });
      console.log("Response from /history:", response);
      const sortedNotifications = response.data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      setNotifications(sortedNotifications);
    } catch (error) {
      console.error("Error fetching parcel history:", error);
      setError("Error fetching parcel history");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-75">
        {/* Navigation Dropdown */}
        <Dropdown className="mb-3">
          <Dropdown.Toggle variant="secondary" id="dropdown-navigation">
            Navigate to
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {/* Define routes for other pages using Link */}
            <Dropdown.Item as={Link} to="/profile">
              Home
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/sendparcel">
              Send Parcel
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/History">
              History
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/deleteaccount">
              Delete Account
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/logout">
              Logout
            </Dropdown.Item>
            {/* Add more items for other pages as needed */}
          </Dropdown.Menu>
        </Dropdown>
<div>
        {/* Display notifications */}
        <h1 className="text-center">Notifications</h1>
        {error && <p className="text-danger">{error}</p>}
        <Row xs={1} md={1} lg={1} xl={1}>
        {notifications.map((notification) => (
          <Col key={notification.notificationid}>
            <Card style={{ minWidth: "250px", marginBottom: "20px" }}>
              <Card.Body>
                <Card.Title>{notification.type}</Card.Title>
                <Card.Text>
                  <strong></strong> {notification.timestamp}
                  <br />
                  {notification.content}
                  <br />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
           </Row>
           </div>
      </div>
    </div>
  );
}

export default Notifications;