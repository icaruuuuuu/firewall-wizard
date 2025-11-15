import { get } from '../../back/requests.js'

const veredict_table = document.getElementById('verdict-table')
const veredict_table_body = document.getElementById('verdict-table-body')

async function loadTable() {
  console.log(await get('verdicts'))
}

loadTable()
