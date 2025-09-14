import express from 'express'
import dotnet from 'dotenv'
import fs from 'node:fs'
import yaml from 'yaml'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'
import router from './router'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

dotnet.config()

const app = express()
const port = process.env.PORT || 3000

const swaggerYaml = fs.readFileSync('./api-documentation/swagger.yaml', 'utf8')
const swaggerDocument = yaml.parse(swaggerYaml)

app.use('/api-documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(morgan('tiny'))

// When built with docker, the frontend will be served on port 80
// When running locally, the frontend will be served on port 3000
// This allows the backend to accept requests from both ports
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost',
  'http://localhost:5173',
  process.env.CORS_ORIGIN || 'http://localhost:8080',
]
app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(router)

export const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

export default app
