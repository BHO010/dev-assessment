import request from 'supertest'
import app from '../app'
import * as registerService from '../services/register.service'

jest.mock('../services/register.service')

const mockRegisterStudents = jest.mocked(registerService.registerStudents)

beforeEach(() => jest.clearAllMocks())

describe('POST /api/register', () => {
  describe('success', () => {
    it('returns 204 on valid request with a single student', async () => {
      mockRegisterStudents.mockResolvedValue()

      const res = await request(app)
        .post('/api/register')
        .send({
          teacher: 'teacherken@gmail.com',
          students: ['studentjon@gmail.com'],
        })

      expect(res.status).toBe(204)
      expect(mockRegisterStudents).toHaveBeenCalledWith('teacherken@gmail.com', [
        'studentjon@gmail.com',
      ])
    })

    it('returns 204 on valid request with multiple students', async () => {
      mockRegisterStudents.mockResolvedValue()

      const res = await request(app)
        .post('/api/register')
        .send({
          teacher: 'teacherken@gmail.com',
          students: ['studentjon@gmail.com', 'studenthon@gmail.com'],
        })

      expect(res.status).toBe(204)
      expect(mockRegisterStudents).toHaveBeenCalledWith('teacherken@gmail.com', [
        'studentjon@gmail.com',
        'studenthon@gmail.com',
      ])
    })
  })

  describe('validation errors', () => {
    it('returns 400 when teacher field is missing', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({ students: ['studentjon@gmail.com'] })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
      expect(mockRegisterStudents).not.toHaveBeenCalled()
    })

    it('returns 400 when teacher is not a valid email', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({ teacher: 'not-an-email', students: ['studentjon@gmail.com'] })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
      expect(mockRegisterStudents).not.toHaveBeenCalled()
    })

    it('returns 400 when students field is missing', async () => {
      const res = await request(app).post('/api/register').send({ teacher: 'teacherken@gmail.com' })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
      expect(mockRegisterStudents).not.toHaveBeenCalled()
    })

    it('returns 400 when students array is empty', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({ teacher: 'teacherken@gmail.com', students: [] })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
      expect(mockRegisterStudents).not.toHaveBeenCalled()
    })

    it('returns 400 when a student email is invalid', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({ teacher: 'teacherken@gmail.com', students: ['valid@gmail.com', 'not-an-email'] })

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
      expect(mockRegisterStudents).not.toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    it('returns 500 when the service throws an unexpected error', async () => {
      mockRegisterStudents.mockRejectedValue(new Error('DB connection failed'))

      const res = await request(app)
        .post('/api/register')
        .send({
          teacher: 'teacherken@gmail.com',
          students: ['studentjon@gmail.com'],
        })

      expect(res.status).toBe(500)
      expect(res.body).toHaveProperty('message')
    })
  })
})
