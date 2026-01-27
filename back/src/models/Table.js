export default { createTable, readTableAll, readTableById, updateTable, removeTable }

// import { createId } from '@paralleldrive/cuid2'
// import { tables } from '../../database/db.js'

import prisma from '../lib/prisma.js'

async function createTable({ name, family, description = "-" }) {
  const newTable = await prisma.tables.create({
    data: {
      name,
      family,
      description
    }
  })

  return newTable
}

async function readTableAll() {
  return await prisma.tables.findMany()
}

async function readTableById(id) {
  const tableId = parseInt(id)
  return await prisma.tables.findUnique({ where: { id: tableId } })
}

async function updateTable({ id, name, family, description = "-" }) {
  const tableId = parseInt(id)

  try {
    return await prisma.tables.update({
      where: { id: tableId },
      data: {
        name,
        family,
        description
      }
    })
  } catch (error) {
    if (error.code == 'P2025') return null
  }
}

async function removeTable(id) {
  const tableId = parseInt(id)

  try {
    await prisma.tables.delete({ where: { id: tableId } })
    return true

  } catch (error) {
    if (error.code == 'P2025') return false
  }
}
