import { get } from './requests.js'

const verdict_table = document.getElementById('verdict-table')
const verdict_table_body = document.getElementById('verdict-table-body')
const log_filter = document.getElementById('log-filter')
const log_filter_regex = document.getElementById('log-filter-regex')

function loadLine(verdicts, index) {
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

  if (td_action.textContent == 'Allow') {
    td_action.classList.add('badge', 'badge-allow')
  } else {
    td_action.classList.add('badge', 'badge-block')
  }

  current_tr.appendChild(td_action)
}

async function loadVerdictTable() {
  const verdicts = await get('verdicts')
  
  verdict_table_body.innerHTML = ''

  for (const index in verdicts) {
    loadLine(verdicts, index)
  }
}

async function loadVerdictTableFilter(pattern, name = 'all') {
  const verdicts = await get('verdicts')

  verdict_table_body.innerHTML = ''

  if (name == 'date') {
    for (const index in verdicts) {
      if (verdicts[index].date == pattern) {
        loadLine(verdicts, index)
      }
    }
  } else if (name == 'time') {
      for (const index in verdicts) {
        if (verdicts[index].time == pattern) {
          loadLine(verdicts, index)
        }
      }
  } else if (name == 'source_ip') {
      for (const index in verdicts) {
        if (verdicts[index].source_ip == pattern) {
          loadLine(verdicts, index)
        }
      }
  } else if (name == 'source_port') {
      for (const index in verdicts) {
        if (verdicts[index].source_port == pattern) {
          loadLine(verdicts, index)
        }
      }
  } else if (name == 'dest_ip') {
      for (const index in verdicts) {
        if (verdicts[index].dest_ip == pattern) {
          loadLine(verdicts, index)
        }
      }
  } else if (name == 'dest_port') {
      for (const index in verdicts) {
        if (verdicts[index].dest_port == pattern) {
          loadLine(verdicts, index)
        }
      }
  } else if (name == 'action') {
      for (const index in verdicts) {
        if (verdicts[index].action == pattern) {
          loadLine(verdicts, index)
        }
      }
  } else {
    for (const index in verdicts) {
      if (verdicts[index].date == pattern ||
      verdicts[index].time == pattern ||
      verdicts[index].source_ip == pattern ||
      verdicts[index].source_port == pattern ||
      verdicts[index].dest_ip == pattern ||
      verdicts[index].dest_port == pattern ||
      verdicts[index].action == pattern) {
        loadLine(verdicts, index)
      }
    }
  }
}

loadVerdictTable()

