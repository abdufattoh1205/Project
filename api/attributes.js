import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

function getPrisma() {
  if (!globalForPrisma.__prisma) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set')
    }
    const pool = new Pool(process.env.DATABASE_URL)
    const adapter = new PrismaNeon(pool)
    globalForPrisma.__prisma = new PrismaClient({ adapter })
  }
  return globalForPrisma.__prisma
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (e) {
        reject(new Error('Invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  try {
    const prisma = getPrisma()

    if (req.method === 'GET') {
      const attributes = await prisma.attribute.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return res.status(200).json(attributes)
    }

    if (req.method === 'POST') {
      const body = await parseBody(req)
      const { name, category, dataType, description } = body

      if (!name || !category || !dataType) {
        return res.status(400).json({ error: 'All fields are required' })
      }

      const attribute = await prisma.attribute.create({
        data: { name, category, dataType, description }
      })
      return res.status(201).json(attribute)
    }

    if (req.method === 'DELETE') {
      const id = req.url.split('/api/attributes/')[1]
      if (!id) return res.status(400).json({ error: 'ID is required' })

      await prisma.attribute.delete({ where: { id } })
      return res.status(200).json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Handler error:', error)
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Attribute name already exists' })
    }
    globalForPrisma.__prisma = null
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    })
  }
}
