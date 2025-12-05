import express from 'express'
import morgan from 'morgan'
// importar rotas
// importar semente

const app = express()

app.use(morgan('dev'))
app.use(express.json())
// app.use static
// app.use rotas

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000')
})
