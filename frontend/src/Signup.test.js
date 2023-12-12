import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import Signup from './Signup';

jest.mock('axios');

describe('Signup Component', () => {
  test('renders Signup component', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );

    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  test('validates user signup with valid data', async () => {
    render(
      <Router>
        <Signup />
      </Router>
    );

    // Mock the axios post request
    axios.post.mockResolvedValue({ data: {} });

    // Fill out the form with valid data
    fireEvent.change(screen.getByPlaceholderText('Enter name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter email'), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'password123' },
    });

    fireEvent.submit(screen.getByText('Create Account'));

    // Wait for the axios post request to be called
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // Verify that the notification message is displayed
    expect(
      screen.getByText('Account created successfully. Redirecting to Login page')
    ).toBeInTheDocument();
  });

  // Add more test cases for error and edge cases, if needed
});
