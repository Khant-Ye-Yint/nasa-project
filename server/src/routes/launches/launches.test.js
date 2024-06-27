const request = require('supertest');
const app = require('../../app.js');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo.js');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('Test GET /launches', () => {
    test('It should repond with 200 success', async () => {
      const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });

  describe('Test POST /launches', () => {
    const completeLaunchData = {
      mission: 'Wuwu Mission',
      rocket: 'Wurocket',
      target: 'Kepler-62 f',
      launchDate: 'June 13, 2023',
    };

    const launchDataWithoutDate = {
      mission: 'Wuwu Mission',
      rocket: 'Wuwu Rocket',
      target: 'Kepler-62 f',
    };

    const launchDataWithInvalidDate = {
      mission: 'Wuwu Mission',
      rocket: 'Wurocket',
      target: 'Kepler-62 f',
      launchDate: 'min may',
    };

    test('It should respond with 201 created', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);
      // expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test('It should catch missing required property.', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Missing launch property',
      });
    });

    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);
    });
  });
});
