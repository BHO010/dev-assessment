import './openapi/extend'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { errorHandler } from './middleware/errorHandler'
import { setupOpenApi } from './openapi/setup'
import routes from './routes'

const app = express()

app.set('trust proxy', 1)

const limiter = rateLimit({
  windowMs: Number(process.env['RATE_LIMIT_WINDOW_MS'] ?? 15 * 60 * 1000),
  limit: Number(process.env['RATE_LIMIT_MAX'] ?? 100),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
})

const corsOptions = process.env['CORS_OPTIONS'] ? JSON.parse(process.env['CORS_OPTIONS']) : {}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        scriptSrcElem: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        styleSrcElem: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }),
)
app.use(cors(corsOptions))
app.use(express.json())
app.use(limiter)

setupOpenApi(app)

app.use('/api', routes)

app.use(errorHandler)

export default app
