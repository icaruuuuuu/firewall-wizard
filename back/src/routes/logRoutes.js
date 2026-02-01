export { router_logs }

import { Router } from 'express'
import LogService from '../models/Log.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router_logs = Router()

router_logs.use(authMiddleware)

// Create
router_logs.post('/logs', async (req, res) => {
  const { sourceIp, sourcePort, destIp, destPort, action } = req.body

  if (!sourceIp || !sourcePort || !destIp || !destPort || !action) {
    return res.status(400).json({ error: 'Source IP, source port, destination IP, destination port and action are required.' })
  }

  try {
    const new_log = await LogService.createLog({ sourceIp, sourcePort, destIp, destPort, action })
    return res.status(201).json(new_log)

  } catch (error) {
    console.error('Failed to create log:', error.message)
    return res.status(500).json({ error: error.message || 'Internal error.' })
  }
})

// Read All
router_logs.get('/logs', async (req, res) => {
  try {
    const logs = await LogService.readLogAll()
    return res.json(logs || [])  // inspecionar

  } catch (error) {
    console.error('Failed to fetch logs:', error)
    return res.status(500).json({ error: 'Failed to fetch logs' })
  }
})

// Read Single
router_logs.get('/logs/:id', async (req, res) => {
  const { id } = req.params

  try {
    const log = await LogService.readLogById(id)

    if (!log) {
      return res.status(404).json({ error: "Log not found." })
    }
    return res.json(log)

  } catch (error) {
    console.error('Failed to fetch log:', error)
    return res.status(500).json({ error: 'Failed to fetch log' })
  }
})

// Update
router_logs.put('/logs/:id', async (req, res) => {
  const { id } = req.params
  const { sourceIp, sourcePort, destIp, destPort, action } = req.body

  if (!sourceIp || !sourcePort || !destIp || !destPort || !action) {
    return res.status(400).json({ error: 'Source IP, source port, destination IP, destination port and action are required.' })
  }

  try {
    const changed_log = await LogService.updateLog({ id, sourceIp, sourcePort, destIp, destPort, action })

    if (!changed_log) {
      return res.status(404).json({ error: 'Log not found.' })
    }
    return res.status(200).json(changed_log)

  } catch (error) {
    console.error('Failed to update log:', error.message)
    return res.status(500).json({ error: error.message || 'Failed to update log' })
  }
})

// Delete
router_logs.delete('/logs/:id', async (req, res) => {
  const { id } = req.params

  try {
    const removed_log = await LogService.removeLog(id)

    if (!removed_log) {
      return res.status(404).json({ error: 'Log not found.' })
    }
    return res.status(204).send()

  } catch (error) {
    console.error('Failed to delete log:', error.message)
    return res.status(500).json({ error: error.message || 'Failed to delete log' })
  }
})
