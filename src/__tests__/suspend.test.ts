import request from 'supertest'
import app from '../app'
import { NotFoundError } from '../errors'
import * as suspendService from '../services/suspend.service'

jest.mock('../services/suspend.service')

const mockSuspendStudent = jest.mocked(suspendService.suspendStudent)

beforeEach(() => jest.clearAllMocks())

describe('POST /api/suspend', () => {
  describe('success', () => {
    it('returns 204 when student is suspended', async () => {
      mockSuspendStudent.mockResolvedValue()

      const res = await request(app).post('/api/suspend').send({ student: 'studentmary@gmail.com' })

      expect(res.status).toBe(204)
      expect(mockSuspendStudent).toHaveBeenCalledWith('studentmary@gmail.com')
    })
  })

  describe('validation errors', () => {
    it('returns 400 when student field is missing', async () => {
      const res = await request(app).post('/api/suspend').send({})

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
      expect(mockSuspendStudent).not.toHaveBeenCalled()
    })

    it('returns 400 when student is not a valid email', async () => {
      const res = await request(app).post('/api/suspend').send({ student: 'not-an-email' })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
      expect(mockSuspendStudent).not.toHaveBeenCalled()
    })
  })

  describe('not found', () => {
    it('returns 404 when student does not exist', async () => {
      mockSuspendStudent.mockRejectedValue(
        new NotFoundError('Student studentmary@gmail.com not found'),
      )

      const res = await request(app).post('/api/suspend').send({ student: 'studentmary@gmail.com' })

      expect(res.status).toBe(404)
      expect(res.body).toEqual({ message: 'Student studentmary@gmail.com not found' })
    })
  })

  describe('error handling', () => {
    it('returns 500 when the service throws an unexpected error', async () => {
      mockSuspendStudent.mockRejectedValue(new Error('DB connection failed'))

      const res = await request(app).post('/api/suspend').send({ student: 'studentmary@gmail.com' })

      expect(res.status).toBe(500)
      expect(res.body).toHaveProperty('message')
    })
  })
})
