export default { readAllResources }

import { tables, chains, rules } from '../../database/db.js'

function readAllResources() {
  const db = {
    tables: tables,
    chains: chains,
    rules: rules
  }
  return db
}
