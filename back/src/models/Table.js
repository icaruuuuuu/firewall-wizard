export default { createTable, readTableAll, readTableById, updateTable, removeTable }

import { createId } from '@paralleldrive/cuid2'
import { tables } from '../../database/db.js'

function createTable({ name, family, description }) {
  const new_table = {
    id: createId(),
    name,
    family,
    description
  }

  tables.push(new_table)
  return new_table
}

function readTableAll() {
  return tables
}

function readTableById(id) {
  return tables.find(t => t.id === id)
}

function updateTable({ id, name, family, description }) {
  const table_index = tables.findIndex(t => t.id === id)

  if (table_index === -1) {
    return null
  }

  const table = {
    id,
    name,
    family,
    description
  }

  tables[table_index] = table
  return tables[table_index]
}

function removeTable(id) {
  const table_index = tables.findIndex(t => t.id === id)

  if (table_index === -1) {
    return false
  }

  tables.splice(table_index, 1)
  return true
}
