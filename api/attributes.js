import { PrismaNeonHttp } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

const global = globalThis
let prisma = global.prisma

async function initPrisma() {
  if (!prisma) {
    const url = process.env.DATABASE_URL?.trim()
    
    if (!url) {
      throw new Error('DATABASE_URL environment variable is missing or empty')
    }

    try {
      // Using the HTTP adapter instead of the TCP Pool.
      // This is the recommended way for Vercel serverless functions.
      const adapter = new PrismaNeonHttp(url)
      prisma = new PrismaClient({ adapter })
      global.prisma = prisma
    } catch (err) {
      console.error('Failed to initialize PrismaNeonHttp:', err)
      throw err
    }
  }
  return prisma
}

async function getRequestBody(req) {
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
    const prismaClient = await initPrisma()

    if (req.method === 'GET') {
      const attributes = await prismaClient.attribute.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return res.status(200).json(attributes)
    }

    if (req.method === 'POST') {
      const body = await getRequestBody(req)
      const { name, category, dataType, description } = body

      if (!name || !category || !dataType) {
        return res.status(400).json({ error: 'All fields are required: name, category, and dataType' })
      }

      const attribute = await prismaClient.attribute.create({
        data: { name, category, dataType, description }
      })
      return res.status(201).json(attribute)
    }

    if (req.method === 'DELETE') {
      const id = req.url.split('/api/attributes/')[1]
      if (!id) {
        return res.status(400).json({ error: 'Attribute ID is required in the URL' })
      }

      await prismaClient.attribute.delete({ where: { id } })
      return res.status(200).json({ success: true })
    }

    return res.status(405).json({ error: `Method ${req.method} not allowed` })

  } catch (error) {
    console.error('Serverless function error:', error)
    
    if (error.message?.includes('connection') || error.message?.includes('host')) {
      global.prisma = null
    }

    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Attribute name already exists' })
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      detail: 'Check Vercel logs for more information'
    })
  }
}
