export default { createRule, readRuleAll, readRuleById, updateRule, removeRule }

import { createId } from '@paralleldrive/cuid2'
import { rules } from '../../database/db.js'

function createRule({ chain_id, position, description, matches, action, counter, enabled }) {
  const rule = {
    id: createId(),
    chain_id,
    position,
    description,
    matches,
    action,
    counter,
    enabled
  }

  rules.push(rule)
  return rule
}

function readRuleAll() {
  return rules
}

function readRuleById(id) {
  return rules.find(r => r.id === id)
}

function updateRule({ id, chain_id, position, description, matches, action, counter, enabled }) {
  const rule_index = rules.findIndex(r => r.id === id)

  if (rule_index === -1) {
    return null
  }

  const rule = {
    id,
    chain_id,
    position,
    description,
    matches,
    action,
    counter,
    enabled
  }

  rules[rule_index] = rule
  return rules[rule_index]
}

function removeRule(id) {
  const rule_index = rules.findIndex(r => r.id === id)

  if (rule_index === -1) {
    return false
  }

  rules.splice(rule_index, 1)
  return true
}
