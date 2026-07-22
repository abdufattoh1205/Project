import "dotenv/config"
import express from 'express'
import attributeRoutes from './routes/attributes.js'

const app = express()
app.use(express.json())
app.use('/api/attributes', attributeRoutes)

const PORT = 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))