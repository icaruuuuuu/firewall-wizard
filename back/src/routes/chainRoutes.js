import { Router } from 'express'
import ChainService from '../models/Chain.js'
import { isAuthenticated } from '../middlewares/auth.js'

const router_chains = Router()
// Create
router_chains.post('/chains', isAuthenticated, async (req, res) => {
  const { tableId, name, type, hook, priority, policy, description } = req.body

  if (!tableId || !name || !type || !hook || priority === undefined || !policy) {
    return res.status(400).json({ error: 'ID da tabela, nome, tipo, gancho, prioridade e política são obrigatórios.' })
  }

  try {
    const new_chain = await ChainService.createChain({ tableId, name, type, hook, priority, policy, description })
    return res.status(201).json(new_chain)

  } catch (error) {
    console.error('Erro ao criar cadeia:', error.message)
    return res.status(500).json({ error: error.message || 'Erro interno.' })
  }
})

// Read All
router_chains.get('/chains', isAuthenticated, async (req, res) => {
  try {
    const chains = await ChainService.readChainAll()
    return res.json(chains || [])

  } catch (error) {
    console.error('Erro ao buscar cadeias:', error)
    return res.status(500).json({ error: 'Erro ao buscar cadeias' })
  }
})

// Read Single
router_chains.get('/chains/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params

  try {
    const chain = await ChainService.readChainById(id)

    if (!chain) {
      return res.status(404).json({ error: "Cadeia não encontrada." })
    }
    return res.json(chain)

  } catch (error) {
    console.error('Erro ao buscar cadeia:', error)
    return res.status(500).json({ error: 'Erro ao buscar cadeia' })
  }
})

// Update
router_chains.put('/chains/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params
  const { tableId, name, type, hook, priority, policy, description } = req.body

  if (!tableId || !name || !type || !hook || priority === undefined || !policy) {
    return res.status(400).json({ error: 'ID da tabela, nome, tipo, gancho, prioridade e política são obrigatórios.' })
  }

  try {
    const changed_chain = await ChainService.updateChain({ id, tableId, name, type, hook, priority, policy, description })

    if (!changed_chain) {
      return res.status(404).json({ error: 'Cadeia não encontrada.' })
    }
    return res.status(200).json(changed_chain)

  } catch (error) {
    console.error('Erro ao atualizar cadeia:', error.message)
    return res.status(500).json({ error: error.message || 'Erro ao atualizar cadeia' })
  }
})

// Delete
router_chains.delete('/chains/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params

  try {
    const removed_chain = await ChainService.removeChain(id)

    if (!removed_chain) {
      return res.status(404).json({ error: 'Cadeia não encontrada.' })
    }
    return res.status(204).send()

  } catch (error) {
    console.error('Erro ao deletar cadeia:', error.message)
    return res.status(500).json({ error: error.message || 'Erro ao deletar cadeia' })
  }
})

export { router_chains }
