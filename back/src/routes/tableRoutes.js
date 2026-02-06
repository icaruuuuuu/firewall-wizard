import { Router } from 'express'
import TableService from '../models/Table.js'
import { isAuthenticated } from '../middlewares/auth.js'

const router_tables = Router()

// Create
router_tables.post('/tables', isAuthenticated, async (req, res) => {
  const { name, family, description } = req.body

  if (!name || !family) {
    return res.status(400).json({ error: 'Nome e família são obrigatórios.' })
  }

  try {
    const new_table = await TableService.createTable({ name, family, description })
    return res.status(201).json(new_table)

  } catch (error) {
    console.error('Erro ao criar tabela:', error.message)
    return res.status(500).json({ error: error.message || 'Erro interno.' })
  }
})

// Read All
router_tables.get('/tables', isAuthenticated, async (req, res) => {
  try {
    const tables = await TableService.readTableAll()
    return res.json(tables || [])

  } catch (error) {
    console.error('Erro ao buscar tabelas:', error)
    return res.status(500).json({ error: 'Erro ao buscar tabelas' })
  }
})

// Read Single
router_tables.get('/tables/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params

  try {
    const table = await TableService.readTableById(id)

    if (!table) {
      return res.status(404).json({ error: "Tabela não encontrada." })
    }
    return res.json(table)

  } catch (error) {
    console.error('Erro ao buscar tabela:', error)
    return res.status(500).json({ error: 'Erro ao buscar tabela' })
  }
})

// Update
router_tables.put('/tables/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params
  const { name, family, description } = req.body

  if (!name || !family) {
    return res.status(400).json({ error: 'Nome e família são obrigatórios.' })
  }

  try {
    const changed_table = await TableService.updateTable({ id, name, family, description })

    if (!changed_table) {
      return res.status(404).json({ error: 'Tabela não encontrada.' })
    }
    return res.status(200).json(changed_table)

  } catch (error) {
    console.error('Erro ao atualizar tabela:', error.message)
    return res.status(500).json({ error: error.message || 'Erro ao atualizar tabela' })
  }
})

// Delete
router_tables.delete('/tables/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params

  try {
    const removed_table = await TableService.removeTable(id)

    if (!removed_table) {
      return res.status(404).json({ error: 'Tabela não encontrada.' })
    }
    return res.status(204).send()

  } catch (error) {
    console.error('Erro ao deletar tabela:', error.message)
    return res.status(500).json({ error: error.message || 'Erro ao deletar tabela' })
  }
})

export { router_tables }
