const server = require('../src/server/server');
const request = require('supertest');
  test('Functionality you are testing', async (_done_) => {
    request(server)
    .get('https://localhost:3000/load')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, _done_);
  })