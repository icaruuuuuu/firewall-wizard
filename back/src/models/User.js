export default { createUser }

import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js'

async function createUser({ name, email, password }) {
  // verifica se usuário já existe
  const userExists = await prisma.user.findUnique({
    where: { email }
  })

  if (userExists) {
    throw new Error('Usuário já cadastrado')
  }

  // gera hash da senha
  const passwordHash = await bcrypt.hash(password, 10)

  // cria usuário
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash
    }
  })

  return user
}

