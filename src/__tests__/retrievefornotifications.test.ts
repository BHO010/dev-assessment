import request from 'supertest'
import app from '../app'
import * as notificationService from '../services/retrievefornotifications.service'

jest.mock('../services/retrievefornotifications.service')

const mockGetRecipients = jest.mocked(notificationService.getRecipientsForNotification)

beforeEach(() => jest.clearAllMocks())

describe('POST /api/retrievefornotifications', () => {
  describe('success', () => {
    it('returns registered students and @mentioned students combined', async () => {
      mockGetRecipients.mockResolvedValue([
        'studentA@school.com',
        'studentB@school.com',
        'studentC@school.com',
      ])

      const res = await request(app).post('/api/retrievefornotifications').send({
        teacher: 'teacherA@school.com',
        notification: 'Hello students! @studentB@school.com @studentC@school.com',
      })

      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        recipients: ['studentA@school.com', 'studentB@school.com', 'studentC@school.com'],
      })
      expect(mockGetRecipients).toHaveBeenCalledWith(
        'teacherA@school.com',
        'Hello students! @studentB@school.com @studentC@school.com',
      )
    })

    it('returns only registered students when there are no @mentions', async () => {
      mockGetRecipients.mockResolvedValue(['studentA@school.com'])

      const res = await request(app)
        .post('/api/retrievefornotifications')
        .send({ teacher: 'teacherA@school.com', notification: 'Hey everybody' })

      expect(res.status).toBe(200)
      expect(res.body).toEqual({ recipients: ['studentA@school.com'] })
    })

    it('returns empty array when teacher has no students and no @mentions', async () => {
      mockGetRecipients.mockResolvedValue([])

      const res = await request(app)
        .post('/api/retrievefornotifications')
        .send({ teacher: 'teacherA@school.com', notification: 'Hey everybody' })

      expect(res.status).toBe(200)
      expect(res.body).toEqual({ recipients: [] })
    })

    it('excludes suspended students (handled by service)', async () => {
      mockGetRecipients.mockResolvedValue(['studentB@school.com'])

      const res = await request(app).post('/api/retrievefornotifications').send({
        teacher: 'teacherA@school.com',
        notification: 'Hi @studentB@school.com',
      })

      expect(res.status).toBe(200)
      expect(res.body).toEqual({ recipients: ['studentB@school.com'] })
    })

    it('returns no duplicate recipients', async () => {
      mockGetRecipients.mockResolvedValue(['studentA@school.com'])

      const res = await request(app).post('/api/retrievefornotifications').send({
        teacher: 'teacherA@school.com',
        notification: 'Hi @studentA@school.com',
      })

      expect(res.status).toBe(200)
      expect(res.body.recipients).toHaveLength(1)
    })
  })

  describe('validation errors', () => {
    it('returns 400 when teacher field is missing', async () => {
      const res = await request(app)
        .post('/api/retrievefornotifications')
        .send({ notification: 'Hello!' })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
      expect(mockGetRecipients).not.toHaveBeenCalled()
    })

    it('returns 400 when teacher is not a valid email', async () => {
      const res = await request(app)
        .post('/api/retrievefornotifications')
        .send({ teacher: 'not-an-email', notification: 'Hello!' })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
      expect(mockGetRecipients).not.toHaveBeenCalled()
    })

    it('returns 400 when notification field is missing', async () => {
      const res = await request(app)
        .post('/api/retrievefornotifications')
        .send({ teacher: 'teacherA@school.com' })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
      expect(mockGetRecipients).not.toHaveBeenCalled()
    })

    it('returns 400 when notification is an empty string', async () => {
      const res = await request(app)
        .post('/api/retrievefornotifications')
        .send({ teacher: 'teacherA@school.com', notification: '' })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
      expect(mockGetRecipients).not.toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    it('returns 500 when the service throws an unexpected error', async () => {
      mockGetRecipients.mockRejectedValue(new Error('DB connection failed'))

      const res = await request(app)
        .post('/api/retrievefornotifications')
        .send({ teacher: 'teacherA@school.com', notification: 'Hello!' })

      expect(res.status).toBe(500)
      expect(res.body).toHaveProperty('message')
    })
  })
})
