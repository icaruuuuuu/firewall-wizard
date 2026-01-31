import { Router } from 'express'
import bcrypt from 'bcrypt'
import { PrismaClient } from '../../database/generated/prisma/client.ts'

const router_users = Router()

// CADASTRO DE USUÁRIO
router_users.post('/signup', async (req, res) => {
  const { name, email, password } = req.body

  // validação básica
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Dados inválidos' })
  }

  try {
    // verifica se já existe
    const userExists = await prisma.user.findUnique({
      where: { email }
    })

    if (userExists) {
      return res.status(400).json({ error: 'Usuário já cadastrado' })
    }

    // criptografa a senha
    const passwordHash = await bcrypt.hash(password, 10)

    // cria usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash
      }
    })

    return res.status(200).json({
      message: 'Usuário cadastrado com sucesso',
      id: user.id,
      name: user.name,
      email: user.email
    })

  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
})

export { router_users }
