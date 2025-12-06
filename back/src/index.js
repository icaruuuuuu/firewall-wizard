import express from 'express'
import morgan from 'morgan'
import Seed from '../database/seeders.js'

import { router_tables } from './routes/tableRoutes.js'
import { router_chains } from './routes/chainRoutes.js'
import { router_logs } from './routes/logRoutes.js'
// importar rota rules
// importar semente

const app = express()
app.use(morgan('dev'))
app.use(express.json())
// app.use static

app.use('/api', router_tables)
app.use('/api', router_chains)
app.use('/api', router_logs)

Seed.up()

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000')
})
