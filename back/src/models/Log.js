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
    orderBy: { logDatetime: 'desc' }
  })
}

function readLogById(id) {
  return logs.find(l => l.id === id)
}

function updateLog({ id, date, time, source_ip, source_port, dest_ip, dest_port, action }) {
  const log_index = logs.findIndex(l => l.id === id)

  if (log_index === -1) {
    return null
  }

  const log = {
    id,
    date,
    time,
    source_ip,
    source_port,
    dest_ip,
    dest_port,
    action
  }

  logs[log_index] = log
  return logs[log_index]
}

function removeLog(id) {
  const log_index = logs.findIndex(l => l.id === id)

  if (log_index === -1) {
    return false
  }

  logs.splice(log_index, 1)
  return true
}
