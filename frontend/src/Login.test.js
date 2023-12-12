import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Login';

jest.mock('axios');

describe('Login Component', () => {
  test('renders Login component', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  test('validates user login with valid data', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    // Mock the axios post request
    axios.post.mockResolvedValue({ data: { token: 'mockToken', user: { id: 1, email: 'test@example.com' } } });

    // Fill out the form with valid data
    fireEvent.change(screen.getByPlaceholderText('Enter email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'password123' },
    });

    fireEvent.submit(screen.getByText('Log In'));

    // Wait for the axios post request to be called
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // Verify that the notification message is not displayed
    expect(screen.queryByText('User is not registered. Create an account to use the app.')).not.toBeInTheDocument();

    // Verify that the token is stored in localStorage
    expect(localStorage.getItem('token')).toBe('mockToken');

    // Verify that the user is redirected to the profile page
    expect(screen.getByText('Authentication succeeded:', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Logged in successfully')).toBeInTheDocument();
  });

});
