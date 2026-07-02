/**
 * Copyright (c) 2026 LIU QI. All Rights Reserved.
 * This software is proprietary and confidential.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 */

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

dotenv.config()

import { errorHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/requestLogger'
import { rateLimiter } from './middleware/rateLimiter'

// TODO: Import route modules when created
// import { authRoutes } from './routes/auth'
// import { userRoutes } from './routes/user'
// import { squareRoutes } from './routes/square'
// import { chatRoutes } from './routes/chat'
// import { labRoutes } from './routes/lab'
// import { gameRoutes } from './routes/game'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(requestLogger)
app.use(rateLimiter)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// TODO: API Routes
// app.use(`${process.env.API_PREFIX}/auth`, authRoutes)
// app.use(`${process.env.API_PREFIX}/users`, userRoutes)
// app.use(`${process.env.API_PREFIX}/square`, squareRoutes)
// app.use(`${process.env.API_PREFIX}/chat`, chatRoutes)
// app.use(`${process.env.API_PREFIX}/lab`, labRoutes)
// app.use(`${process.env.API_PREFIX}/game`, gameRoutes)

// Placeholder routes for development
app.get(`${process.env.API_PREFIX || '/api/v1'}/status`, (_req, res) => {
  res.json({
    service: 'MASK Server',
    version: '0.1.0',
    env: process.env.NODE_ENV,
    aiProviders: {
      deepseek: !!process.env.DEEPSEEK_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
    },
  })
})

// Error handler (must be last)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🎭 MASK Server running on port ${PORT}`)
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔗 API: http://localhost:${PORT}${process.env.API_PREFIX || '/api/v1'}`)
})
