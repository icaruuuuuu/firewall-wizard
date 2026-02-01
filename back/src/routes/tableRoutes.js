export { router_tables }

import { Router } from 'express'
import TableService from '../models/Table.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router_tables = Router()

// router_tables.use(authMiddleware)

// Create
router_tables.post('/tables', async (req, res) => {
  const { name, family, description } = req.body

  if (!name || !family) {
    return res.status(400).json({ error: 'Name and family are required.' })
  }

  try {
    const new_table = await TableService.createTable({ name, family, description })
    return res.status(201).json(new_table)

  } catch (error) {
    console.error('Failed to create table:', error.message)
    return res.status(500).json({ error: error.message || 'Internal error.' })
  }
})

// Read All
router_tables.get('/tables', async (req, res) => {
  try {
    const tables = await TableService.readTableAll()
    return res.json(tables || [])  // inspecionar

  } catch (error) {
    console.error('Failed to fetch tables:', error)
    return res.status(500).json({ error: 'Failed to fetch tables' })
  }
})

// Read Single
router_tables.get('/tables/:id', async (req, res) => {
  const { id } = req.params

  try {
    const table = await TableService.readTableById(id)

    if (!table) {
      return res.status(404).json({ error: "Table not found." })
    }
    return res.json(table)

  } catch (error) {
    console.error('Failed to fetch table:', error)
    return res.status(500).json({ error: 'Failed to fetch table' })
  }
})

// Update
router_tables.put('/tables/:id', async (req, res) => {
  const { id } = req.params
  const { name, family, description } = req.body

  if (!name || !family) {
    return res.status(400).json({ error: 'Name and family are required.' })
  }

  try {
    const changed_table = await TableService.updateTable({ id, name, family, description })

    if (!changed_table) {
      return res.status(404).json({ error: 'Table not found.' })
    }
    return res.status(200).json(changed_table)

  } catch (error) {
    console.error('Failed to update table:', error.message)
    return res.status(500).json({ error: error.message || 'Failed to update table' })
  }
})

// Delete
router_tables.delete('/tables/:id', async (req, res) => {
  const { id } = req.params

  try {
    const removed_table = await TableService.removeTable(id)

    if (!removed_table) {
      return res.status(404).json({ error: 'Table not found.' })
    }
    return res.status(204).send()

  } catch (error) {
    console.error('Failed to delete table:', error.message)
    return res.status(500).json({ error: error.message || 'Failed to delete table' })
  }
})
