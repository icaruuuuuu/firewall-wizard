import { Router } from 'express'
import LogService from '../models/Log.js'
import { isAuthenticated } from '../middlewares/auth.js'

const router_logs = Router()
// Create
router_logs.post('/logs', isAuthenticated, async (req, res) => {
  const { sourceIp, sourcePort, destIp, destPort, action } = req.body

  if (!sourceIp || !sourcePort || !destIp || !destPort || !action) {
    return res.status(400).json({ error: 'IP de origem, porta de origem, IP de destino, porta de destino e ação são obrigatórios.' })
  }

  try {
    const new_log = await LogService.createLog({ sourceIp, sourcePort, destIp, destPort, action })
    return res.status(201).json(new_log)

  } catch (error) {
    console.error('Erro ao criar log:', error.message)
    return res.status(500).json({ error: error.message || 'Erro interno.' })
  }
})

// Read All
router_logs.get('/logs', isAuthenticated, async (req, res) => {
  try {
    const logs = await LogService.readLogAll()
    return res.json(logs || [])

  } catch (error) {
    console.error('Erro ao buscar logs:', error)
    return res.status(500).json({ error: 'Erro ao buscar logs' })
  }
})

// Read Single
router_logs.get('/logs/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params

  try {
    const log = await LogService.readLogById(id)

    if (!log) {
      return res.status(404).json({ error: "Log não encontrado." })
    }
    return res.json(log)

  } catch (error) {
    console.error('Erro ao buscar log:', error)
    return res.status(500).json({ error: 'Erro ao buscar log' })
  }
})

// Update
router_logs.put('/logs/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params
  const { sourceIp, sourcePort, destIp, destPort, action } = req.body

  if (!sourceIp || !sourcePort || !destIp || !destPort || !action) {
    return res.status(400).json({ error: 'IP de origem, porta de origem, IP de destino, porta de destino e ação são obrigatórios.' })
  }

  try {
    const changed_log = await LogService.updateLog({ id, sourceIp, sourcePort, destIp, destPort, action })

    if (!changed_log) {
      return res.status(404).json({ error: 'Log não encontrado.' })
    }
    return res.status(200).json(changed_log)

  } catch (error) {
    console.error('Erro ao atualizar log:', error.message)
    return res.status(500).json({ error: error.message || 'Erro ao atualizar log' })
  }
})

// Delete
router_logs.delete('/logs/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params

  try {
    const removed_log = await LogService.removeLog(id)

    if (!removed_log) {
      return res.status(404).json({ error: 'Log não encontrado.' })
    }
    return res.status(204).send()

  } catch (error) {
    console.error('Erro ao deletar log:', error.message)
    return res.status(500).json({ error: error.message || 'Erro ao deletar log' })
  }
})

export { router_logs }