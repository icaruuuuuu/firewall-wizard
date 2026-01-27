export default { createLog, readLogAll, readLogById, updateLog, removeLog }

// import { createId } from '@paralleldrive/cuid2'
// import { logs } from '../../database/db.js'

import prisma from '../lib/prisma.js'

async function createLog({ sourceIp, sourcePort, destIp, destPort, action }) {
  const newLog = await prisma.logs.create({
    data: {
      sourceIp,
      sourcePort,
      destIp,
      destPort,
      action
    }
  })

  return newLog
}

async function readLogAll() {
  return await prisma.logs.findMany({
    orderBy: { datetime: 'desc' }
  })
}

async function readLogById(id) {
  const logId = parseInt(id)
  return await prisma.logs.findUnique({ where: { id: logId } })
}

async function updateLog({ id, sourceIp, sourcePort, destIp, destPort, action }) {
  const logId = parseInt(id)

  try {
    return await prisma.logs.update({
      where: { id: logId },
      data: {
        sourceIp,
        sourcePort,
        destIp,
        destPort,
        action
      }
    })

  } catch (error) {
    if (error.code == 'P2025') return null
  }
}

async function removeLog(id) {
  const logId = parseInt(id)

  try {
    await prisma.logs.delete({ where: { id: logId } })
    return true

  } catch (error) {
    if (error.code == 'P2025') return false
  }
}
