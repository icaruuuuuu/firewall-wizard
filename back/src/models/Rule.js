export default { createRule, readRuleAll, readRuleById, updateRule, removeRule }

// import { createId } from '@paralleldrive/cuid2'
// import { rules } from '../../database/db.js'

import prisma from '../lib/prisma.js'

async function createRule({ chainId, matchType, match, expression, statement }) {
  const newRule = await prisma.rules.create({
    data: {
      matchType,
      match,
      expression,
      statement,
      chainId
    }
  })

  return newRule
}

async function readRuleAll() {
  return await prisma.rules.findMany()
}

async function readRuleById(id) {
  const ruleId = parseInt(id)
  return await prisma.rules.findUnique({ where: { id: ruleId } })
}

async function updateRule({ id, chainId, matchType, match, expression, statement }) {
  const ruleId = parseInt(id)

  try {
    return await prisma.rules.update({
      where: { id: ruleId },
      data: {
        matchType,
        match,
        expression,
        statement,
        chainId
      }
    })
  } catch (error) {
    if (error.code == 'P2025') return null
  }
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
