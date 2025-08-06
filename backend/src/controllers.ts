import { Request, Response } from 'express'
import { promises as fs } from 'fs'
import path from 'path'
import { Resource, CreateResourceRequest, UpdateResourceRequest } from './types'

const dbPath = path.join(__dirname, '..', 'database.json')

async function loadData(): Promise<Resource[]> {
  try {
    const data = await fs.readFile(dbPath, 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveData(resources: Resource[]): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(resources, null, 2))
}

function getNextId(resources: Resource[]): number {
  return resources.length > 0 ? Math.max(...resources.map((r) => r.id)) + 1 : 1
}

// GET / - Get API info with database statistics
export const getApiInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const resources = await loadData()

    res.json({
      message: 'Simple Express CRUD API is running!',
      endpoints: [
        'GET /api/resources - Get all resources',
        'GET /api/resources/:id - Get resource by ID',
        'POST /api/resources - Create resource',
        'PUT /api/resources/:id - Update resource',
        'DELETE /api/resources/:id - Delete resource',
      ],
      database: {
        total_resources: resources.length,
        storage: 'JSON file',
      },
    })
  } catch (error) {
    console.error('Error getting API info:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// GET /api/resources - Get all resources
export const getResources = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category, status } = req.query
    let resources = await loadData()

    if (category) {
      resources = resources.filter(
        (r) => r.category.toLowerCase() === (category as string).toLowerCase()
      )
    }

    if (status) {
      resources = resources.filter(
        (r) => r.status.toLowerCase() === (status as string).toLowerCase()
      )
    }

    resources.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    res.json(resources)
  } catch (error) {
    console.error('Error getting resources:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// GET /api/resources/:id - Get single resource
export const getResource = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id)
    const resources = await loadData()
    const resource = resources.find((r) => r.id === id)

    if (!resource) {
      res.status(404).json({ error: 'Resource not found' })
      return
    }

    res.json(resource)
  } catch (error) {
    console.error('Error getting resource:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// POST /api/resources - Create resource
export const createResource = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      category,
      status = 'active',
    }: CreateResourceRequest = req.body

    if (!name || !description || !category) {
      res.status(400).json({
        error: 'Name, description, and category are required',
        received: { name, description, category },
      })
      return
    }

    const resources = await loadData()
    const newResource: Resource = {
      id: getNextId(resources),
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      status: status.trim() as 'active' | 'inactive',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    resources.push(newResource)
    await saveData(resources)

    res.status(201).json(newResource)
  } catch (error) {
    console.error('Error creating resource:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// PUT /api/resources/:id - Update resource
export const updateResource = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id)
    const { name, description, category, status }: UpdateResourceRequest =
      req.body

    const resources = await loadData()
    const resourceIndex = resources.findIndex((r) => r.id === id)

    if (resourceIndex === -1) {
      res.status(404).json({ error: 'Resource not found' })
      return
    }

    const resource = resources[resourceIndex]

    if (name !== undefined) resource.name = name.trim()
    if (description !== undefined) resource.description = description.trim()
    if (category !== undefined) resource.category = category.trim()
    if (status !== undefined)
      resource.status = status.trim() as 'active' | 'inactive'

    resource.updatedAt = new Date().toISOString()

    await saveData(resources)
    res.json(resource)
  } catch (error) {
    console.error('Error updating resource:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// DELETE /api/resources/:id - Delete resource
export const deleteResource = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id)

    const resources = await loadData()
    const resourceIndex = resources.findIndex((r) => r.id === id)

    if (resourceIndex === -1) {
      res.status(404).json({ error: 'Resource not found' })
      return
    }

    resources.splice(resourceIndex, 1)
    await saveData(resources)

    res.json({
      message: 'Resource deleted successfully',
      id,
      remaining_count: resources.length,
    })
  } catch (error) {
    console.error('Error deleting resource:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
