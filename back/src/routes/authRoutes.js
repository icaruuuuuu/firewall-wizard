import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router_auth = Router()

// LOGIN
router_auth.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' })
  }

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos' })
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos' })
  }

  // gera token com expiração
  const token = jwt.sign(
    { userId: user.id },
    'secret_key_firewallwizard', // depois pode ir para .env
    { expiresIn: '1h' }
  )

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  })
})

export { router_auth }
