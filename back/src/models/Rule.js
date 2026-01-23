export default { createRule, readRuleAll, readRuleById, updateRule, removeRule }

// import { createId } from '@paralleldrive/cuid2'
// import { rules } from '../../database/db.js'

import prisma from '../lib/prisma.js'

async function createRule({ chain_id, position, description, matches, action, counter, enabled }) {
  const newRule = await prisma.rules.create({
    data: {

    }
  })

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

async function readRuleAll() {
  return await prisma.rules.findMany()
}

async function readRuleById(id) {
  const ruleId = parseInt(id)
  return await prisma.rules.findUnique({ where: { id: ruleId } })
}

async function updateRule({ id, chain_id, position, description, matches, action, counter, enabled }) {
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

async function removeRule(id) {
  const ruleId = parseInt(id)

  try {
    await prisma.rules.delete({ where: { id: ruleId } })
    return true

  } catch (error) {
    if (error.code == 'P2025') return false
  }
}
