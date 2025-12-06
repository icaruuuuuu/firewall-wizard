import { get, loadLine, testPattern, downloadResource } from '../../utils/lib.js'

const tables_json = await get('tables')
const chains_json = await get('chains')
const rules_json = await get('rules')
const logs_json = await get('logs')

const tables_keys = ['name']
const chains_keys = ['table_id', 'name']
const rules_keys = ['chain_id', 'description']

const tables_body = document.getElementById('tables-body')
const chains_body = document.getElementById('chains-body')
const rules_body = document.getElementById('rules-body')

const tables_count = document.getElementById('tables-count')
const chains_count = document.getElementById('chains-count')
const rules_count = document.getElementById('rules-count')

const tables_total = document.getElementById('total-tables')
const chains_total = document.getElementById('total-chains')
const rules_total = document.getElementById('total-rules')

const blocked_packets = document.getElementById('blocked-packets')
const search_input = document.getElementById('search-input')
const download_btn = document.getElementById('download-btn')

function loadDashboardData(tables, chains, rules) {
  tables_body.innerHTML = ''
  chains_body.innerHTML = ''
  rules_body.innerHTML = ''

  for (const index in tables) {
    loadLine(tables, 'tables', index, tables_body, tables_keys)
  }

  for (const index in chains) {
    loadLine(chains, 'chains', index, chains_body, chains_keys)
  }

  for (const index in rules) {
    loadLine(rules, 'rules', index, rules_body, rules_keys)
  }
}

function loadDashboardFilter(tables, chains, rules, pattern, key = 'all') {
  tables_body.innerHTML = ''
  chains_body.innerHTML = ''
  rules_body.innerHTML = ''

  switch (key) { // name, table_id, chain_id, description
    case 'name':
      for (const index in tables) {
        if (testPattern(tables[index].name, pattern)) {
          loadLine(tables, 'tables', index, tables_body, tables_keys)
        }
      }

      for (const index in chains) {
        if (testPattern(chains[index].name, pattern)) {
          loadLine(chains, 'chains', index, chains_body, chains_keys)
        }
      }
      break

    case 'table_id':
      for (const index in chains) {
        if (testPattern(chains[index].table_id, pattern)) {
          loadLine(chains, 'chains', index, chains_body, chains_keys)
        }
      }
      break

    case 'chain_id':
      for (const index in rules) {
        if (testPattern(rules[index].chain_id, pattern)) {
          loadLine(rules, 'rules', index, rules_body, rules_keys)
        }
      }
      break

    case 'description':
      for (const index in rules) {
        if (testPattern(rules[index].description, pattern)) {
          loadLine(rules, 'rules', index, rules_body, rules_keys)
        }
      }
      break

    default:
      if (pattern != '' && key == 'all') {
        for (const index in tables) {
          if (testPattern(tables[index].name, pattern)) {
            loadLine(tables, 'tables', index, tables_body, tables_keys)
          }
        }

        for (const index in chains) {
          if (testPattern(chains[index].table_id, pattern) ||
            testPattern(chains[index].name, pattern)) {
            loadLine(chains, 'chains', index, chains_body, chains_keys)
          }
        }

        for (const index in rules) {
          if (testPattern(rules[index].chain_id, pattern) ||
            testPattern(rules[index].description, pattern)) {
            loadLine(rules, 'rules', index, rules_body, rules_keys)
          }
        }
      }
      else {
        loadDashboardData(tables_json, chains_json, rules_json)
      }
      break
  }
}

function calculateBlockedPackets() {
  let counter = 0
  for (const index in logs_json) {
    if (logs_json[index].action == 'Block') {
      counter++
    }
  }
  return counter
}

search_input.oninput = (event) => {
  let parameters = search_input.value.split(';')
  parameters = parameters.map(value => value.trim())
  loadDashboardFilter(tables_json, chains_json, rules_json, parameters[0], parameters[1])
  tables_count.innerText = tables_body.childElementCount
  chains_count.innerText = chains_body.childElementCount
  rules_count.innerText = rules_body.childElementCount
}

download_btn.onclick = (event) => {
  downloadResource('db')
}

// Initialize dashboard
function loadStart() {
  loadDashboardData(tables_json, chains_json, rules_json)

  tables_count.innerText = tables_body.childElementCount
  chains_count.innerText = chains_body.childElementCount
  rules_count.innerText = rules_body.childElementCount

  blocked_packets.innerText = calculateBlockedPackets()
  tables_total.innerText = tables_json.length
  chains_total.innerText = chains_json.length
  rules_total.innerText = rules_json.length
}

loadStart()
