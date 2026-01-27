export { router_chains }

import { Router } from 'express'
import ChainService from '../models/Chain.js'

const router_chains = Router()

// Create
router_chains.post('/chains', (req, res) => {
  try {
    const { tableId, name, type, hook, priority, policy, description } = req.body

    if (!tableId || !name || !type || !hook || !priority || !policy) {
      return res.status(400).json({ error: 'Table ID, name, type, hook, priority, policy and description are required.' })
    }

    const new_chain = ChainService.createChain({ tableId, name, type, hook, priority, policy, description })
    return res.status(201).json(new_chain)

  } catch (error) {
    return res.status(403).json({ error: error.message })
  }
})

// Read All
router_chains.get('/chains', (req, res) => {
  const chains = ChainService.readChainAll()
  return res.json(chains)
})

// Read Single
router_chains.get('/chains/:id', (req, res) => {
  const { id } = req.params
  const chain = ChainService.readChainById(id)

  if (!chain) {
    return res.status(404).json({ error: "Chain not found." })
  }

  return res.json(chain)
})

// Update
router_chains.put('/chains/:id', (req, res) => {
  try {
    const { id } = req.params
    const { tableId, name, type, hook, priority, policy, description } = req.body

    if (!tableId || !name || !type || !hook || !priority || !policy) {
      return res.status(400).json({ error: 'Table ID, name, type, hook, priority and policy are required.' })
    }

    const changed_chain = ChainService.updateChain({ id, tableId, name, type, hook, priority, policy, description })

    if (!changed_chain) {
      return res.status(404).json({ error: 'Chain not found.' })
    }

    return res.status(200).json(changed_chain)

  } catch (error) {
    return res.status(403).json({ error: error.message })
  }
})

// Delete
router_chains.delete('/chains/:id', (req, res) => {
  const { id } = req.params
  const removed_chain = ChainService.removeChain(id)

  if (!removed_chain) {
    return res.status(404).json({ error: 'Chain not found.' })
  }

  return res.status(204).send()
})
