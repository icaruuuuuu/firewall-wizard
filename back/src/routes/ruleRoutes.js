export { router_rules }

import { Router } from 'express'
import RuleService from '../models/Rule.js'

const router_rules = Router()

// Create
router_rules.post('/rules', (req, res) => {
  const { chainId, matchType, match, expression, statement, description } = req.body

  if (!chainId || !matchType || !match || !expression || !statement) {
    return res.status(400).json({ error: 'Chain ID, matchType, match, expression and statement are required.' })
  }

  const new_rule = RuleService.createRule({ chainId, matchType, match, expression, statement })
  return res.status(201).json(new_rule)
})

// Read All
router_rules.get('/rules', (req, res) => {
  const rules = RuleService.readRuleAll()
  return res.json(rules)
})

// Read Single
router_rules.get('/rules/:id', (req, res) => {
  const { id } = req.params
  const rule = RuleService.readRuleById(id)

  if (!rule) {
    return res.status(404).json({ error: "Rule not found." })
  }

  return res.json(rule)
})

// Update
router_rules.put('/rules/:id', (req, res) => {
  const { id } = req.params
  const { chainId, matchType, match, expression, statement, description } = req.body

  if (!chainId || !matchType || !match || !expression || !statement) {
    return res.status(400).json({ error: 'Chain ID, matchType, match, expression and statement are required.' })
  }

  const changed_rule = RuleService.updateRule({ id, chainId, matchType, match, expression, statement })

  if (!changed_rule) {
    return res.status(404).json({ error: 'Rule not found.' })
  }

  return res.status(200).json(changed_rule)
})

// Delete
router_rules.delete('/rules/:id', (req, res) => {
  const { id } = req.params
  const removed_rule = RuleService.removeRule(id)

  if (!removed_rule) {
    return res.status(404).json({ error: 'Rule not found.' })
  }

  return res.status(204).send()
})
