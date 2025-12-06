export { router_tables }

import { Router } from 'express'
import TableService from '../models/Table.js'

const router_tables = Router()

// Create
router_tables.post('/tables', (req, res) => {
  const { name, family, description } = req.body

  if (!name || !family || !description) {
    return res.status(400).json({ error: 'Name, family and description are required.' })
  }

  const new_table = TableService.createTable({ name, family, description })
  return res.status(201).json(new_table)
})

// Read All
router_tables.get('/tables', (req, res) => {
  const tables = TableService.readTableAll()
  return res.json(tables)
})

// Read Single
router_tables.get('/tables/:id', (req, res) => {
  const { id } = req.params
  const table = TableService.readTableById(id)

  if (!table) {
    return res.status(404).json({ error: "Table not found." })
  }

  return res.json(table)
})

// Update
router_tables.put('/tables/:id', (req, res) => {
  const { id } = req.params
  const { name, family, description } = req.body

  if (!name || !family || !description) {
    return res.status(400).json({ error: 'Name, family and description are required.' })
  }

  const changed_table = TableService.updateTable({ id, name, family, description })

  if (!changed_table) {
    return res.status(404).json({ error: 'Table not found.' })
  }

  return res.status(200).json(changed_table)
})

// Delete
router_tables.delete('/tables/:id', (req, res) => {
  const { id } = req.params
  const removed_table = TableService.removeTable(id)

  if (!removed_table) {
    return res.status(404).json({ error: 'Table not found.' })
  }

  return res.status(204).send()
})
