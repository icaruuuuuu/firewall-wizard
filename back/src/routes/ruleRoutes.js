import { Router } from 'express'
import RuleService from '../models/Rule.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router_rules = Router()

router_rules.use(authMiddleware)

// Create
router_rules.post('/rules', async (req, res) => {
  const { chainId, matchType, match, expression, statement, description } = req.body

  if (!chainId || !matchType || !match || !expression || !statement) {
    return res.status(400).json({ error: 'Chain ID, matchType, match, expression and statement are required.' })
  }

  try {
    const new_rule = await RuleService.createRule({ chainId, matchType, match, expression, statement, description })
    return res.status(201).json(new_rule)

  } catch (error) {
    console.error('Failed to create rule:', error.message)
    return res.status(500).json({ error: error.message || 'Internal error.' })
  }
})

// Read All
router_rules.get('/rules', async (req, res) => {
  try {
    const rules = await RuleService.readRuleAll()
    return res.json(rules || [])  // inspecionar

  } catch (error) {
    console.error('Failed to fetch rules:', error)
    return res.status(500).json({ error: 'Failed to fetch rules' })
  }
})

// Read Single
router_rules.get('/rules/:id', async (req, res) => {
  const { id } = req.params

  try {
    const rule = await RuleService.readRuleById(id)

    if (!rule) {
      return res.status(404).json({ error: "Rule not found." })
    }
    return res.json(rule)

  } catch (error) {
    console.error('Failed to fetch rule:', error)
    return res.status(500).json({ error: 'Failed to fetch rule' })
  }
})

// Update
router_rules.put('/rules/:id', async (req, res) => {
  const { id } = req.params
  const { chainId, matchType, match, expression, statement, description } = req.body

  if (!chainId || !matchType || !match || !expression || !statement) {
    return res.status(400).json({ error: 'Chain ID, matchType, match, expression and statement are required.' })
  }

  try {
    const changed_rule = await RuleService.updateRule({ id, chainId, matchType, match, expression, statement, description })

    if (!changed_rule) {
      return res.status(404).json({ error: 'Rule not found.' })
    }
    return res.status(200).json(changed_rule)

  } catch (error) {
    console.error('Failed to update rule:', error.message)
    return res.status(500).json({ error: error.message || 'Failed to update rule' })
  }
})

// Delete
router_rules.delete('/rules/:id', async (req, res) => {
  const { id } = req.params

  try {
    const removed_rule = await RuleService.removeRule(id)

    if (!removed_rule) {
      return res.status(404).json({ error: 'Rule not found.' })
    }
    return res.status(204).send()

  } catch (error) {
    console.error('Failed to delete rule:', error.message)
    return res.status(500).json({ error: error.message || 'Failed to delete rule' })
  }
})

export { router_rules }