import request from 'supertest';
import app from './Login'; 

// Mocking the database query function
jest.mock('mysql', () => ({
  createConnection: jest.fn(() => ({
    query: jest.fn(),
  })),
}));

describe('POST /login', () => {
  it('should log in successfully and return access token', async () => {
    jest.mock('./tokenUtility', () => ({
      createTokens: jest.fn(() => 'mockedAccessToken'),
    }));

    // Mock the database query to simulate a user being found in the database
    jest.spyOn(require('mysql').prototype, 'query').mockImplementationOnce((sql, values, callback) => {
      callback(null, [{ userid: 1, name: 'TestUser', email: 'test@example.com' }]);
    });

    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Logged in successfully',
      user: { id: 1, email: 'test@example.com' },
    });
    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie'][0]).toContain('access-token=mockedAccessToken');
  });

  it('should return 404 status if the user is not found', async () => {
    // Mock the database query to simulate no user found in the database
    jest.spyOn(require('mysql').prototype, 'query').mockImplementationOnce((sql, values, callback) => {
      callback(null, []);
    });

    const response = await request(app)
      .post('/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'testpassword',
      });

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: 'User not found. Please create an account.' });
  });

  it('should return 500 status if there is an error querying the database', async () => {
    // Mock the database query to simulate an error during the query
    jest.spyOn(require('mysql').prototype, 'query').mockImplementationOnce((sql, values, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword',
      });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: 'Error while querying the database' });
  });
});
