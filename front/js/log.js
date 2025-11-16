import { get } from './requests.js'

const verdict_table = document.getElementById('verdict-table')
const verdict_table_body = document.getElementById('verdict-table-body')

async function loadVerdictTable() {
  const verdicts = await get('verdicts')
  
  for (const index in verdicts) {
    console.log(verdicts[index])

    const tr = document.createElement('tr')
    tr.id = `verdict-tr-${index}`
    verdict_table_body.appendChild(tr)
    
    const current_tr = document.getElementById(`verdict-tr-${index}`)

    const td_date = document.createElement('td')
    td_date.id = `verdict-td-date-${index}`
    td_date.textContent = `${verdicts[index].date}`
    current_tr.appendChild(td_date)

    const td_time = document.createElement('td')
    td_time.id = `verdict-td-time-${index}`
    td_time.textContent = `${verdicts[index].time}`
    current_tr.appendChild(td_time)

    const td_sourceip = document.createElement('td')
    td_sourceip.id = `verdict-td-sourceip-${index}`
    td_sourceip.textContent = `${verdicts[index].source_ip}`
    current_tr.appendChild(td_sourceip)

    const td_sourceport = document.createElement('td')
    td_sourceport.id = `verdict-td-sourceport-${index}`
    td_sourceport.textContent = `${verdicts[index].source_port}`
    current_tr.appendChild(td_sourceport)

    const td_destip = document.createElement('td')
    td_destip.id = `verdict-td-destip-${index}`
    td_destip.textContent = `${verdicts[index].dest_ip}`
    current_tr.appendChild(td_destip)

    const td_destport = document.createElement('td')
    td_destport.id = `verdict-td-destport-${index}`
    td_destport.textContent = `${verdicts[index].dest_port}`
    current_tr.appendChild(td_destport)

    const td_action = document.createElement('td')
    td_action.id = `verdict-td-action-${index}`
    td_action.textContent = `${verdicts[index].action}`
    current_tr.appendChild(td_action)
  }
}

loadVerdictTable()