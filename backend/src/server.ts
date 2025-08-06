import * as express from 'express'
import path from 'path'
import { promises as fs } from 'fs'
import {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  getApiInfo,
} from './controllers'

const app = express.default()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

// Routes
app.get('/', getApiInfo)
app.get('/api/resources', getResources)
app.get('/api/resources/:id', getResource)
app.post('/api/resources', createResource)
app.put('/api/resources/:id', updateResource)
app.delete('/api/resources/:id', deleteResource)

// Start server
app.listen(PORT, async () => {
  const dbPath = path.join(__dirname, '..', 'database.json')

  let resourceCount = 0
  try {
    const data = await fs.readFile(dbPath, 'utf8')
    const resources = JSON.parse(data)
    resourceCount = resources.length
  } catch {
    console.log('Database file not found, starting with empty database')
  }

  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Database: ${resourceCount} resources in ${dbPath}`)
  console.log(`Try GET http://localhost:${PORT}/api/resources`)
})
