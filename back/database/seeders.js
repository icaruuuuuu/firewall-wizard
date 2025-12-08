export default { up }

import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'

import TableService from '../src/models/Table.js'
import ChainService from '../src/models/Chain.js'
import RuleService from '../src/models/Rule.js'
import LogService from '../src/models/Log.js'

function up() {
  const file = resolve('back', 'database', 'seeders.json')
  const seed = JSON.parse(readFileSync(file))

  for (const table of seed.tables) {
    TableService.createTable(table)
  }

  for (const chain of seed.chains) {
    ChainService.createChain(chain)
  }

  for (const rule of seed.rules) {
    RuleService.createRule(rule)
  }

  for (const log of seed.logs) {
    LogService.createLog(log)
  }
}
