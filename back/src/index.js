import express from 'express'
import morgan from 'morgan'
import { router_logs } from './routes/logRoutes.js'
// importar rotas
// importar semente

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use('/api', router_logs)
// app.use static
// app.use rotas

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000')
})
