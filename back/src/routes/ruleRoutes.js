import { Router } from 'express'
import RuleService from '../models/Rule.js'
import { isAuthenticated } from '../middlewares/auth.js'

const router_rules = Router()
// Create
router_rules.post('/rules', isAuthenticated, async (req, res) => {
  let { chainId, matchType, match, expression, statement, description } = req.body
  matchType = "n/a"
  match = "n/a"
  console.log(req.body)

  if (!chainId || !matchType || !match || !expression || !statement) {
    return res.status(400).json({ error: 'ID da cadeia, tipo de correspondência, correspondência, expressão e declaração são obrigatórios.' })
  }

  try {
    const new_rule = await RuleService.createRule({ chainId, matchType, match, expression, statement, description })
    return res.status(201).json(new_rule)

  } catch (error) {
    console.error('Erro ao criar regra:', error.message)
    return res.status(500).json({ error: error.message || 'Erro interno.' })
  }
})

// Read All
router_rules.get('/rules', isAuthenticated, async (req, res) => {
  try {
    const rules = await RuleService.readRuleAll()
    return res.json(rules || [])

  } catch (error) {
    console.error('Erro ao buscar regras:', error)
    return res.status(500).json({ error: 'Erro ao buscar regras' })
  }
})

// Read Single
router_rules.get('/rules/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params

  try {
    const rule = await RuleService.readRuleById(id)

    if (!rule) {
      return res.status(404).json({ error: "Regra não encontrada." })
    }
    return res.json(rule)

  } catch (error) {
    console.error('Erro ao buscar regra:', error)
    return res.status(500).json({ error: 'Erro ao buscar regra' })
  }
})

// Update
router_rules.put('/rules/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params
  let { chainId, matchType, match, expression, statement, description } = req.body
  matchType = "n/a"
  match = "n/a"

  if (!chainId || !matchType || !match || !expression || !statement) {
    return res.status(400).json({ error: 'ID da cadeia, tipo de correspondência, correspondência, expressão e declaração são obrigatórios.' })
  }

  try {
    const changed_rule = await RuleService.updateRule({ id, chainId, matchType, match, expression, statement, description })

    if (!changed_rule) {
      return res.status(404).json({ error: 'Regra não encontrada.' })
    }
    return res.status(200).json(changed_rule)

  } catch (error) {
    console.error('Erro ao atualizar regra:', error.message)
    return res.status(500).json({ error: error.message || 'Erro ao atualizar regra' })
  }
})

// Delete
router_rules.delete('/rules/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params

  try {
    const removed_rule = await RuleService.removeRule(id)

    if (!removed_rule) {
      return res.status(404).json({ error: 'Regra não encontrada.' })
    }
    return res.status(204).send()

  } catch (error) {
    console.error('Erro ao deletar regra:', error.message)
    return res.status(500).json({ error: error.message || 'Erro ao deletar regra' })
  }
})

export { router_rules }
