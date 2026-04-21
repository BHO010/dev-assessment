import request from 'supertest'
import app from '../app'
import * as commonstudentsService from '../services/commonstudents.service'

jest.mock('../services/commonstudents.service')

const mockGetCommonStudents = jest.mocked(commonstudentsService.getCommonStudents)

beforeEach(() => jest.clearAllMocks())

describe('GET /api/commonstudents', () => {
  describe('success', () => {
    it('returns all students for a single teacher', async () => {
      mockGetCommonStudents.mockResolvedValue([
        'studentA@school.com',
        'studentB@school.com',
        'studentC@school.com',
      ])

      const res = await request(app).get('/api/commonstudents?teacher=teacherA%40school.com')

      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        students: ['studentA@school.com', 'studentB@school.com', 'studentC@school.com'],
      })
      expect(mockGetCommonStudents).toHaveBeenCalledWith(['teacherA@school.com'])
    })

    it('returns only students common to all given teachers', async () => {
      mockGetCommonStudents.mockResolvedValue(['studentA@school.com', 'studentB@school.com'])

      const res = await request(app).get(
        '/api/commonstudents?teacher=teacherA%40school.com&teacher=teacherB%40school.com',
      )

      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        students: ['studentA@school.com', 'studentB@school.com'],
      })
      expect(mockGetCommonStudents).toHaveBeenCalledWith([
        'teacherA@school.com',
        'teacherB@school.com',
      ])
    })

    it('returns empty array when no common students exist', async () => {
      mockGetCommonStudents.mockResolvedValue([])

      const res = await request(app).get(
        '/api/commonstudents?teacher=teacherA%40school.com&teacher=teacherB%40school.com',
      )

      expect(res.status).toBe(200)
      expect(res.body).toEqual({ students: [] })
    })
  })

  describe('validation errors', () => {
    it('returns 400 when teacher param is missing', async () => {
      const res = await request(app).get('/api/commonstudents')

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
      expect(mockGetCommonStudents).not.toHaveBeenCalled()
    })

    it('returns 400 when teacher email is invalid', async () => {
      const res = await request(app).get('/api/commonstudents?teacher=not-an-email')

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
      expect(mockGetCommonStudents).not.toHaveBeenCalled()
    })

    it('returns 400 when any teacher email in the list is invalid', async () => {
      const res = await request(app).get(
        '/api/commonstudents?teacher=teacherA%40school.com&teacher=not-an-email',
      )

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message')
      expect(mockGetCommonStudents).not.toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    it('returns 500 when the service throws an unexpected error', async () => {
      mockGetCommonStudents.mockRejectedValue(new Error('DB connection failed'))

      const res = await request(app).get('/api/commonstudents?teacher=teacherA%40school.com')

      expect(res.status).toBe(500)
      expect(res.body).toHaveProperty('message')
    })
  })
})
