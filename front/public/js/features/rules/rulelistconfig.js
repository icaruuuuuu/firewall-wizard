import { loadLine, testPattern, downloadResource } from '../../utils/lib.js'
import { getResource } from '../../api/apiClient.js'

const rules_table = document.getElementById('rulelist-table-body')
const filter_type = document.getElementById('filterType')
const reset_filters_btn = document.getElementById('btnReset')
const search_input = document.getElementById('searchInput')
const download_rules = document.getElementById('download-rules')

const rules_json = await getResource('rules')
const rules_keys = ['chain_id', 'action', 'description', 'enabled', 'matches']

function rules_list_table() {
  rules_table.innerHTML = ''

  for (const index in rules_json) {
    const rule = rules_json[index];

    // VERIFICA se matches é array antes de usar .map()
    if (Array.isArray(rule.matches)) {
      rule.matches = rule.matches
        .map(m => {
          // Converte cada objeto match para string formatada
          if (typeof m === 'object' && m !== null) {
            return Object.entries(m).map(([k, v]) => `${k}: ${v}`).join(" - ");
          }
          return String(m);
        })
        .join("<br>");
    } else {
      // Se não for array, converte para string diretamente
      rule.matches = String(rule.matches || '');
    }

    loadLine(rules_json, 'rules', index, rules_table, rules_keys)
  }
}

rules_list_table()


function applyFilters() {
  rules_table.innerHTML = ''
  const search_status = filter_type.value
  if (search_status === 'all') {
    for (const index in rules_json) {
      loadLine(rules_json, 'rules', index, rules_table, rules_keys)

    }
  }
  else if (search_status === 'true') {
    for (const index in rules_json) {
      if (rules_json[index].enabled === true) {
        loadLine(rules_json, 'rules', index, rules_table, rules_keys)
      }
    }
  }
  else if (search_status === 'false') {
    for (const index in rules_json) {
      if (rules_json[index].enabled === false) {
        loadLine(rules_json, 'rules', index, rules_table, rules_keys)
      }
    }
  }
}

function loadRulesTableFilter(rules, pattern, key = 'all') {
  rules_table.innerHTML = ''

  switch (key) {
    case 'action':
      for (const index in rules) {
        if (testPattern(rules[index].action, pattern)) {
          loadLine(rules, 'rules', index, rules_table, rules_keys)
        }
      }
      break

    case 'description':
      for (const index in rules) {
        if (testPattern(rules[index].description, pattern)) {
          loadLine(rules, 'rules', index, rules_table, rules_keys)
        }
      }
      break

    case 'enabled':
      for (const index in rules) {
        if (testPattern(rules[index].enabled, pattern)) {
          loadLine(rules, 'rules', index, rules_table, rules_keys)
        }
      }
      break

    case 'match':
      for (const index in rules) {
        if (testPattern(rules[index].match, pattern)) {
          loadLine(rules, 'rules', index, rules_table, rules_keys)
        }
      }
      break

    default:
      if (pattern != '' && key == 'all') {
        for (const index in rules) {
          if (testPattern(rules[index].action, pattern) ||
            testPattern(rules[index].description, pattern) ||
            testPattern(rules[index].enabled, pattern) ||
            testPattern(rules[index].match, pattern)) {
            loadLine(rules, 'rules', index, rules_table, rules_keys)
          }
        }
      } else {
        rules_list_table()
      }
      break
  }
}

filter_type.addEventListener('change', applyFilters)


async function resetFilters() {
  filter_type.value = 'all'
  rules_list_table()
}

reset_filters_btn.addEventListener('click', resetFilters)

search_input.oninput = (event) => {
  let parameters = search_input.value.split(';')
  parameters = parameters.map(value => value.trim())
  loadRulesTableFilter(rules_json, parameters[0], parameters[1])
}

download_rules.onclick = (event) => {
  downloadResource('rules')
}