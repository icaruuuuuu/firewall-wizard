import { get, loadLine, downloadResource, testPattern } from './lib.js'

const verdict_table_body = document.getElementById('verdict-table-body')
const log_filter = document.getElementById('log-filter')
const download_log = document.getElementById('download-log')

const verdicts_json = await get('verdicts')
const verdict_keys = ['date', 'time', 'source_ip', 'source_port', 'dest_ip', 'dest_port', 'action']

function loadVerdictTable(verdicts) {
  verdict_table_body.innerHTML = ''

  for (const index in verdicts) {
    loadLine(verdicts, 'verdicts', index, verdict_table_body, verdict_keys)
  }
}

function loadVerdictTableFilter(verdicts, pattern, key = 'all') {
  verdict_table_body.innerHTML = ''

  switch (key) {
    case 'date':
      for (const index in verdicts) {
        if (testPattern(verdicts[index].date, pattern)) {
          loadLine(verdicts, 'verdicts', index, verdict_table_body, verdict_keys)
        }
      }
      break

    case 'time':
      for (const index in verdicts) {
        if (testPattern(verdicts[index].time, pattern)) {
          loadLine(verdicts, 'verdicts', index, verdict_table_body, verdict_keys)
        }
      }
      break

    case 'source_ip':
      for (const index in verdicts) {
        if (testPattern(verdicts[index].source_ip, pattern)) {
          loadLine(verdicts, 'verdicts', index, verdict_table_body, verdict_keys)
        }
      }
      break

    case 'source_port':
      for (const index in verdicts) {
        if (testPattern(verdicts[index].source_port, pattern)) {
          loadLine(verdicts, 'verdicts', index, verdict_table_body, verdict_keys)
        }
      }
      break

    case 'dest_ip':
      for (const index in verdicts) {
        if (testPattern(verdicts[index].dest_ip, pattern)) {
          loadLine(verdicts, 'verdicts', index, verdict_table_body, verdict_keys)
        }
      }
      break

    case 'dest_port':
      for (const index in verdicts) {
        if (testPattern(verdicts[index].dest_port, pattern)) {
          loadLine(verdicts, 'verdicts', index, verdict_table_body, verdict_keys)
        }
      }
      break

    case 'action':
      for (const index in verdicts) {
        if (testPattern(verdicts[index].action, pattern)) {
          loadLine(verdicts, 'verdicts', index, verdict_table_body, verdict_keys)
        }
      }
      break

    default:
      if (pattern != '' && key == 'all') {
        for (const index in verdicts) {
          if (testPattern(verdicts[index].date, pattern) ||
            testPattern(verdicts[index].time, pattern) ||
            testPattern(verdicts[index].source_ip, pattern) ||
            testPattern(verdicts[index].source_port, pattern) ||
            testPattern(verdicts[index].dest_ip, pattern) ||
            testPattern(verdicts[index].dest_port, pattern) ||
            testPattern(verdicts[index].action, pattern)) {
            loadLine(verdicts, 'verdicts', index, verdict_table_body, verdict_keys)
          }
        }
      } else {
        loadVerdictTable(verdicts_json)
      }
      break
  }
}

// Event listeners
log_filter.oninput = (event) => {
  let parameters = log_filter.value.split(';')
  parameters = parameters.map(value => value.trim())
  loadVerdictTableFilter(verdicts_json, parameters[0], parameters[1])
}

download_log.onclick = (event) => {
  downloadResource('verdicts')
}

loadVerdictTable(verdicts_json)

// Antigo loadLine()
// function loadLine(verdicts, index) {
//   console.log(verdicts[index])

//   const tr = document.createElement('tr')
//   tr.id = `verdict-tr-${index}`
//   verdict_table_body.appendChild(tr)

//   const current_tr = document.getElementById(`verdict-tr-${index}`)

//   const td_date = document.createElement('td')
//   td_date.id = `verdict-td-date-${index}`
//   td_date.textContent = `${verdicts[index].date}`
//   current_tr.appendChild(td_date)

//   const td_time = document.createElement('td')
//   td_time.id = `verdict-td-time-${index}`
//   td_time.textContent = `${verdicts[index].time}`
//   current_tr.appendChild(td_time)

//   const td_sourceip = document.createElement('td')
//   td_sourceip.id = `verdict-td-sourceip-${index}`
//   td_sourceip.textContent = `${verdicts[index].source_ip}`
//   current_tr.appendChild(td_sourceip)

//   const td_sourceport = document.createElement('td')
//   td_sourceport.id = `verdict-td-sourceport-${index}`
//   td_sourceport.textContent = `${verdicts[index].source_port}`
//   current_tr.appendChild(td_sourceport)

//   const td_destip = document.createElement('td')
//   td_destip.id = `verdict-td-destip-${index}`
//   td_destip.textContent = `${verdicts[index].dest_ip}`
//   current_tr.appendChild(td_destip)

//   const td_destport = document.createElement('td')
//   td_destport.id = `verdict-td-destport-${index}`
//   td_destport.textContent = `${verdicts[index].dest_port}`
//   current_tr.appendChild(td_destport)

//   const td_action = document.createElement('td')
//   td_action.id = `verdict-td-action-${index}`
//   td_action.textContent = `${verdicts[index].action}`

//   if (td_action.textContent == 'Allow') {
//     td_action.classList.add('badge', 'badge-allow')
//   } else {
//     td_action.classList.add('badge', 'badge-block')
//   }

//   current_tr.appendChild(td_action)
// }