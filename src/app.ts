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
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", 'https://unpkg.com'],
        'script-src-elem': ["'self'", 'https://unpkg.com'],
        'style-src': ["'self'", 'https://unpkg.com'],
        'style-src-elem': ["'self'", 'https://unpkg.com'],
        'img-src': ["'self'", 'data:'],
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
