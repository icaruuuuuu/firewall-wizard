import { Router } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js'

const router_users = Router()

// CADASTRO DE USUÁRIO
router_users.post('/signup', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Dados inválidos' })
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { email }
    })

    if (userExists) {
      return res.status(400).json({ error: 'Usuário já cadastrado' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash
      }
    })

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      id: user.id,
      name: user.name,
      email: user.email
    })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

export { router_users }
