const request = require('supertest');
const app = require('./Signup');  // Assuming your Signup.js exports an Express app
const bcrypt = require('bcrypt');

// Mocking the bcrypt.hash function
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockReturnValue('hashedPassword'),
}));

// Mocking the database query function
const mockDBQuery = jest.fn();

jest.mock('mysql', () => ({
  createConnection: jest.fn(() => ({
    query: mockDBQuery,
  })),
}));

describe('POST /signup', () => {
  it('should register a new user successfully', async () => {
    // Mock the database query to simulate a new user being successfully inserted
    mockDBQuery.mockImplementationOnce((query, values, callback) => {
      callback(null, []);
    });

    const response = await request(app)
      .post('/signup')
      .send({
        name: 'TestUser',
        email: 'test@example.com',
        password: 'testpassword',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ message: 'User registered successfully' });
  });

  it('should return 409 status if the user already exists', async () => {
    // Mock the database query to simulate an existing user with the provided email
    mockDBQuery.mockImplementationOnce((query, values, callback) => {
      callback(null, [{ email: 'test@example.com' }]);
    });

    const response = await request(app)
      .post('/signup')
      .send({
        name: 'TestUser',
        email: 'test@example.com',
        password: 'testpassword',
      });

    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({ error: 'User already exists' });
  });

  it('should return 500 status if there is an error checking user existence', async () => {
    // Mock the database query to simulate an error during user existence check
    mockDBQuery.mockImplementationOnce((query, values, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app)
      .post('/signup')
      .send({
        name: 'TestUser',
        email: 'test@example.com',
        password: 'testpassword',
      });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Error while checking user existence' });
  });

  it('should return 500 status if there is an error saving the user to the database', async () => {
    // Mock the database query to simulate an error during user insertion
    mockDBQuery.mockImplementationOnce((query, values, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app)
      .post('/signup')
      .send({
        name: 'TestUser',
        email: 'test@example.com',
        password: 'testpassword',
      });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Error while saving user to the database' });
  });
});
