import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import 'dotenv/config'
// import Seed from '../database/seeders.js'

import path from 'path'
import { fileURLToPath } from 'url'

import { router_dashboard } from './routes/dashboardRoutes.js'
import { router_tables } from './routes/tableRoutes.js'
import { router_chains } from './routes/chainRoutes.js'
import { router_rules } from './routes/ruleRoutes.js'
import { router_logs } from './routes/logRoutes.js'
import { router_users } from './routes/userRoutes.js'
import { router_auth } from './routes/authRoutes.js'
import { router_submit } from './routes/submitRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const index_path = path.join(__dirname, '..', '..', 'front', 'public');

const app = express()
app.use(cors()) // Alterar: revisar segurança
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(index_path))

app.use('/api', router_dashboard)
app.use('/api', router_tables)
app.use('/api', router_chains)
app.use('/api', router_rules)
app.use('/api', router_logs)
app.use('/api', router_users)
app.use('/api', router_auth)
app.use('/api', router_submit)

// Seed.up()

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000')
})
