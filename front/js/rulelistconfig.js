import { get, loadLine} from './lib.js'

const rules_table = document.getElementById('rulelist-table-body')

async function rules_list_table() {
  const rules = await get('rules')
  
  rules_table.innerHTML = ''
  

  for (const index in rules) {
    loadLine(rules, 'rules', index, rules_table,
    ['id', 'chain_id', 'position', 'description'] )
  }
}

rules_list_table()