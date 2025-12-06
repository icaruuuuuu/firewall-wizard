export { router_logs }

import { Router } from 'express'
import LogService from '../models/Log.js'

const router_logs = Router()

// Create
router_logs.post('/logs', (req, res) => {
  const { date, time, source_ip, source_port, dest_ip, dest_port, action } = req.body

  if (!date || !time || !source_ip || !source_port || !dest_ip || !dest_port || !action) {
    return res.status(400).json({ error: 'Date, time, source IP, source port, destination IP, destination port and action are required.' })
  }

  const new_log = LogService.createLog({ date, time, source_ip, source_port, dest_ip, dest_port, action })
  return res.status(201).json(new_log)
})

// Read All
router_logs.get('/logs', (req, res) => {
  const logs = LogService.readLogAll()
  return res.json(logs)
})

// Read Single
router_logs.get('/logs/:id', (req, res) => {
  const { id } = req.params
  const log = LogService.readLogById(id)

  if (!log) {
    return res.status(404).json({ error: "Log not found." })
  }

  return res.json(log)
})

// Update
router_logs.put('/logs/:id', (req, res) => {
  const { id } = req.params
  const { date, time, source_ip, source_port, dest_ip, dest_port, action } = req.body

  if (!date || !time || !source_ip || !source_port || !dest_ip || !dest_port || !action) {
    return res.status(400).json({ error: 'Date, time, source IP, source port, destination IP, destination port and action are required.' })
  }

  const changed_log = LogService.updateLog({ id, date, time, source_ip, source_port, dest_ip, dest_port, action })

  if (!changed_log) {
    return res.status(404).json({ error: 'Log not found.' })
  }

  return res.status(200).json(changed_log)
})

// Delete
router_logs.delete('/logs/:id', (req, res) => {
  const { id } = req.params
  const removed_log = LogService.removeLog(id)

  if (!removed_log) {
    return res.status(404).json({ error: 'Log not found.' })
  }

  return res.status(204).send()
})
