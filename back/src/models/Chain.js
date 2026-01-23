export default { createChain, readChainAll, readChainById, updateChain, removeChain }

// import { createId } from '@paralleldrive/cuid2'
// import { tables, chains } from '../../database/db.js'

import prisma from '../lib/prisma.js'

async function createChain({ tableId, name, type, hook, priority, policy, description = "" }) {
  const newChain = await prisma.chains.create({
    data: {
      name,
      type,
      hook,
      priority,
      policy,
      description,
      tableId
    }
  })

  return newChain
}

async function readChainAll() {
  return await prisma.chains.findMany()
}

async function readChainById(id) {
  const ChainId = parseInt(id)
  return await prisma.chains.findUnique({ where: { id: ChainId } })
}

async function updateChain({ id, tableId, name, type, hook, priority, policy, description }) {
  const chainId = parseInt(id)

  try {
    return await prisma.chains.update({
      where: { id: chainId },
      data: {
        name,
        type,
        hook,
        priority,
        policy,
        description,
        tableId
      }
    })
  } catch (error) {
    if (error.code == 'P2025') return null
  }
}

async function removeChain(id) {
  const chainId = parseInt(id)

  try {
    await prisma.chains.delete({ where: { id: chainId } })
    return true

  } catch (error) {
    if (error.code == 'P2025') return false
  }
}
