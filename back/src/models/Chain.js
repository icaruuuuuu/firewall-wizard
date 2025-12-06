export default { createChain, readChainAll, readChainById, updateChain, removeChain }

import { createId } from '@paralleldrive/cuid2'
import { tables, chains } from '../../database/db.js'

function createChain({ table_id, name, type, hook, priority, policy, description }) {
  const new_chain = {
    id: createId(),
    table_id,
    name,
    type,
    hook,
    priority,
    policy,
    description
  }

  const is_tableId_valid = tables.find(t => t.id === table_id)
  // Vincular a table name
  // if (!is_tableId_valid) {
  //   throw new Error('Invalid table ID.')
  // }

  chains.push(new_chain)
  return new_chain
}

function readChainAll() {
  return chains
}

function readChainById(id) {
  return chains.find(c => c.id === id)
}

function updateChain({ id, table_id, name, type, hook, priority, policy, description }) {
  const chain_index = chains.findIndex(c => c.id === id)

  if (chain_index === -1) {
    return null
  }

  const chain = {
    id,
    table_id,
    name,
    type,
    hook,
    priority,
    policy,
    description
  }

  const is_tableId_valid = tables.find(t => t.id === table_id)
  // Vincular a table name
  // if (!is_tableId_valid) {
  //   throw new Error('Invalid table ID.')
  // }

  chains[chain_index] = chain
  return chains[chain_index]
}

function removeChain(id) {
  const chain_index = chains.findIndex(c => c.id === id)

  if (chain_index === -1) {
    return false
  }

  chains.splice(chain_index, 1)
  return true
}
