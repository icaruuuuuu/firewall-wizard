export default { readAll }

// import { createId } from '@paralleldrive/cuid2'
// import { tables } from '../../database/db.js'

import prisma from '../lib/prisma.js'

async function readAll() {
  const tables = await prisma.tables.findMany()
  const chains = await prisma.chains.findMany()
  const rules = await prisma.rules.findMany()

  return [tables, chains, rules]
}

