import express from 'express'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
const { Pool } = pg

let dbPool
let dbClient

function getPrisma() {
  if (!dbPool) {
    dbPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  }
  if (!dbClient) {
    const adapter = new PrismaPg(dbPool)
    dbClient = new PrismaClient({ adapter })
  }
  return dbClient
}

function resetPrisma() {
  if (dbClient) { dbClient.$disconnect().catch(() => {}) }
  if (dbPool) { dbPool.end().catch(() => {}) }
  dbClient = null
  dbPool = null
}

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const prisma = getPrisma()
    const attributes = await prisma.attribute.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(attributes)
  } catch (error) {
    console.error('GET error:', error.message)
    resetPrisma()
    res.status(500).json({ error: 'Failed to fetch attributes' })
  }
})

router.post('/', async (req, res) => {
  const { name, category, dataType, description } = req.body

  if (!name || !category || !dataType) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const prisma = getPrisma()
    const attribute = await prisma.attribute.create({
      data: { name, category, dataType, description }
    })
    res.status(201).json(attribute)
  } catch (error) {
    console.error('POST error:', error.message)
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Attribute name already exists' })
    }
    resetPrisma()
    res.status(500).json({ error: 'Failed to create attribute' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const prisma = getPrisma()
    await prisma.attribute.delete({
      where: { id: req.params.id }
    })
    res.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error.message)
    resetPrisma()
    res.status(500).json({ error: 'Failed to delete attribute' })
  }
})

export default router
