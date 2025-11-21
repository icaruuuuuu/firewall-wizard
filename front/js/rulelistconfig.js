import { get, loadLine} from './lib.js'

const rules_table = document.getElementById('rulelist-table-body')
const filter_type = document.getElementById('filterType')
const reset_filters_btn = document.getElementById('btnReset')
async function rules_list_table() {
  const rules = await get('rules')
  
  rules_table.innerHTML = ''
  

  for (const index in rules) {
    const rule = rules[index];
      rule.matches = rule.matches
    .map(m => Object.entries(m).map(([k, v]) => `${k}: ${v}`).join(" - "))
    .join("<br>");
    loadLine(rules, 'rules', index, rules_table,
    ['action', 'description', 'enabled', 'matches'] )
  }
}

rules_list_table()


async function applyFilters() {
    const rules = await get('rules')
    rules_table.innerHTML = ''
    const search_status = filter_type.value
    if (search_status === 'all'){
        for (const index in rules){
          loadLine(rules, 'rules', index, rules_table,
          ['action', 'description', 'enabled', 'matches'] )

        }
    }
    else if (search_status === 'true'){
        for (const index in rules){
          if (rules[index].enabled === true){
            loadLine(rules, 'rules', index, rules_table,
            ['action', 'description', 'enabled', 'matches'] )
          }
        }
    }
    else if (search_status === 'false'){
        for (const index in rules){
          if (rules[index].enabled === false){
            loadLine(rules, 'rules', index, rules_table,
            ['action', 'description', 'enabled', 'matches'] )
          }
        }
    }
}

filter_type.addEventListener('change', applyFilters)


async function resetFilters() {
    filter_type.value = 'all'
    rules_list_table()
}

reset_filters_btn.addEventListener('click', resetFilters)