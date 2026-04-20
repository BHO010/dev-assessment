import request from 'supertest';
import app from '../app';
import * as notificationService from '../services/retrievefornotifications.service';

jest.mock('../services/retrievefornotifications.service');

const mockGetRecipients = jest.mocked(notificationService.getRecipientsForNotification);

beforeEach(() => jest.clearAllMocks());

describe('POST /api/retrievefornotifications', () => {
  describe('success', () => {
    it('returns registered students and @mentioned students combined', async () => {
      mockGetRecipients.mockResolvedValue([
        'studentbob@gmail.com',
        'studentagnes@gmail.com',
        'studentmiche@gmail.com',
      ]);

      const res = await request(app)
        .post('/api/retrievefornotifications')
        .send({
          teacher: 'teacherken@gmail.com',
          notification: 'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com',
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        recipients: ['studentbob@gmail.com', 'studentagnes@gmail.com', 'studentmiche@gmail.com'],
      });
      expect(mockGetRecipients).toHaveBeenCalledWith(
        'teacherken@gmail.com',
        'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com',
      );
    });

    it('returns only registered students when there are no @mentions', async () => {
      mockGetRecipients.mockResolvedValue(['studentbob@gmail.com']);

      const res = await request(app)
        .post('/api/retrievefornotifications')
        .send({ teacher: 'teacherken@gmail.com', notification: 'Hey everybody' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ recipients: ['studentbob@gmail.com'] });
    });

    it('returns empty array when teacher has no students and no @mentions', async () => {
      mockGetRecipients.mockResolvedValue([]);

      const res = await request(app)
        .post('/api/retrievefornotifications')
        .send({ teacher: 'teacherken@gmail.com', notification: 'Hey everybody' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ recipients: [] });
    });

    it('excludes suspended students (handled by service)', async () => {
      // studentbob is suspended, so service only returns studentagnes
      mockGetRecipients.mockResolvedValue(['studentagnes@gmail.com']);

      const res = await request(app)
        .post('/api/retrievefornotifications')
        .send({
          teacher: 'teacherken@gmail.com',
          notification: 'Hi @studentagnes@gmail.com',
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ recipients: ['studentagnes@gmail.com'] });
    });

    it('returns no duplicate recipients', async () => {
      // studentagnes is both registered and @mentioned — service deduplicates
      mockGetRecipients.mockResolvedValue(['studentagnes@gmail.com']);

      const res = await request(app)
        .post('/api/retrievefornotifications')
        .send({
          teacher: 'teacherken@gmail.com',
          notification: 'Hi @studentagnes@gmail.com',
        });

      expect(res.status).toBe(200);
      expect(res.body.recipients).toHaveLength(1);
    });
  });

  describe('validation errors', () => {
    it('returns 400 when teacher field is missing', async () => {
      const res = await request(app)
        .post('/api/retrievefornotifications')
        .send({ notification: 'Hello!' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(mockGetRecipients).not.toHaveBeenCalled();
    });

    it('returns 400 when teacher is not a valid email', async () => {
      const res = await request(app)
        .post('/api/retrievefornotifications')
        .send({ teacher: 'not-an-email', notification: 'Hello!' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(mockGetRecipients).not.toHaveBeenCalled();
    });

    it('returns 400 when notification field is missing', async () => {
      const res = await request(app)
        .post('/api/retrievefornotifications')
        .send({ teacher: 'teacherken@gmail.com' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(mockGetRecipients).not.toHaveBeenCalled();
    });

    it('returns 400 when notification is an empty string', async () => {
      const res = await request(app)
        .post('/api/retrievefornotifications')
        .send({ teacher: 'teacherken@gmail.com', notification: '' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(mockGetRecipients).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('returns 500 when the service throws an unexpected error', async () => {
      mockGetRecipients.mockRejectedValue(new Error('DB connection failed'));

      const res = await request(app)
        .post('/api/retrievefornotifications')
        .send({ teacher: 'teacherken@gmail.com', notification: 'Hello!' });

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('message');
    });
  });
});
