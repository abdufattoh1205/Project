import "dotenv/config"
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const attributes = await prisma.attribute.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(attributes)
  } catch (error) {
    console.error('GET error:', error)
    res.status(500).json({ error: 'Failed to fetch attributes' })
  }
})

router.post('/', async (req, res) => {
  const { name, category, dataType, description } = req.body

  if (!name || !category || !dataType) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const attribute = await prisma.attribute.create({
      data: { name, category, dataType, description }
    })
    res.status(201).json(attribute)
  } catch (error) {
    console.error('POST error:', error)
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Attribute name already exists' })
    }
    res.status(500).json({ error: 'Failed to create attribute' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await prisma.attribute.delete({
      where: { id: req.params.id }
    })
    res.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    res.status(500).json({ error: 'Failed to delete attribute' })
  }
})

export default router