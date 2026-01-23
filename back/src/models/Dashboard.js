export default { readAllResources }

import prisma from '../lib/prisma.js'

async function readAllResources() {
  const tables = await prisma.tables.findMany()
  const chains = await prisma.chains.findMany()
  const rules = await prisma.rules.findMany()

  const db = {
    tables: tables,
    chains: chains,
    rules: rules
  }

  return db
}
