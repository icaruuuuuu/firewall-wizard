export default { createLog, readLogAll, readLogById, updateLog, removeLog }

import { createId } from '@paralleldrive/cuid2'
import { logs } from '../../database/db.js'

function createLog({ date, time, source_ip, source_port, dest_ip, dest_port, action }) {
  const new_log = {
    id: createId(),
    date,
    time,
    source_ip,
    source_port,
    dest_ip,
    dest_port,
    action
  }

  logs.push(new_log)
  return new_log
}

function readLogAll() {
  return logs
}

function readLogById(id) {
  return logs.find(v => v.id === id)
}

function updateLog({ id, date, time, source_ip, source_port, dest_ip, dest_port, action }) {
  const log_index = logs.findIndex(v => v.id === id)

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
  const log_index = logs.findIndex(v => v.id === id)

  if (log_index === -1) {
    return false
  }

  logs.splice(log_index, 1)
  return true
}
