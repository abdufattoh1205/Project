import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

function getPrisma() {
  if (!globalForPrisma.__prisma) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaNeon(pool)
    globalForPrisma.__prisma = new PrismaClient({ adapter })
  }
  return globalForPrisma.__prisma
}

export default async function handler(req, res) {
  const prisma = getPrisma()

  try {
    if (req.method === 'GET') {
      const attributes = await prisma.attribute.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return res.status(200).json(attributes)
    }

    if (req.method === 'POST') {
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      const { name, category, dataType, description } = JSON.parse(Buffer.concat(chunks).toString())

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
    console.error(`${req.method} error:`, error)
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Attribute name already exists' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}
