import { Router } from 'express'
import ChainService from '../models/Chain.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router_chains = Router()

// router_chains.use(authMiddleware)

// Create
router_chains.post('/chains', async (req, res) => {
  const { tableId, name, type, hook, priority, policy, description } = req.body

  if (!tableId || !name || !type || !hook || priority === undefined || !policy) {
    return res.status(400).json({ error: 'Table ID, name, type, hook, priority and policy are required.' })
  }

  try {
    const new_chain = await ChainService.createChain({ tableId, name, type, hook, priority, policy, description })
    return res.status(201).json(new_chain)

  } catch (error) {
    console.error('Failed to create chain:', error.message)
    return res.status(500).json({ error: error.message || 'Internal error.' })
  }
})

// Read All
router_chains.get('/chains', async (req, res) => {
  try {
    const chains = await ChainService.readChainAll()
    return res.json(chains || [])  // inspecionar

  } catch (error) {
    console.error('Failed to fetch chains:', error)
    return res.status(500).json({ error: 'Failed to fetch chains' })
  }
})

// Read Single
router_chains.get('/chains/:id', async (req, res) => {
  const { id } = req.params

  try {
    const chain = await ChainService.readChainById(id)

    if (!chain) {
      return res.status(404).json({ error: "Chain not found." })
    }
    return res.json(chain)

  } catch (error) {
    console.error('Failed to fetch chain:', error)
    return res.status(500).json({ error: 'Failed to fetch chain' })
  }
})

// Update
router_chains.put('/chains/:id', async (req, res) => {
  const { id } = req.params
  const { tableId, name, type, hook, priority, policy, description } = req.body

  if (!tableId || !name || !type || !hook || priority === undefined || !policy) {
    return res.status(400).json({ error: 'Table ID, name, type, hook, priority and policy are required.' })
  }

  try {
    const changed_chain = await ChainService.updateChain({ id, tableId, name, type, hook, priority, policy, description })

    if (!changed_chain) {
      return res.status(404).json({ error: 'Chain not found.' })
    }
    return res.status(200).json(changed_chain)

  } catch (error) {
    console.error('Failed to update chain:', error.message)
    return res.status(500).json({ error: error.message || 'Failed to update chain' })
  }
})

// Delete
router_chains.delete('/chains/:id', async (req, res) => {
  const { id } = req.params

  try {
    const removed_chain = await ChainService.removeChain(id)

    if (!removed_chain) {
      return res.status(404).json({ error: 'Chain not found.' })
    }
    return res.status(204).send()

  } catch (error) {
    console.error('Failed to delete chain:', error.message)
    return res.status(500).json({ error: error.message || 'Failed to delete chain' })
  }
})

export { router_chains }
