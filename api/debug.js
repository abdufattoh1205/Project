export default function handler(req, res) {
  const url = process.env.DATABASE_URL
  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({
    defined: !!url,
    length: url ? url.length : 0,
    prefix: url ? url.substring(0, 20) + '...' : null,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || 'not set'
  })
}
