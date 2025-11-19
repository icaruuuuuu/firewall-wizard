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

  switch (name) {
    case 'date':
      for (const index in verdicts) {
        if (verdicts[index].date == pattern) {
          loadLine(verdicts, index)
        }
      }
      break
      
    case 'time':
      for (const index in verdicts) {
        if (verdicts[index].time == pattern) {
          loadLine(verdicts, index)
        }
      }
      break
      
    case 'source_ip':
      for (const index in verdicts) {
        if (verdicts[index].source_ip == pattern) {
          loadLine(verdicts, index)
        }
      }
      break
      
    case 'source_port':
      for (const index in verdicts) {
        if (verdicts[index].source_port == pattern) {
          loadLine(verdicts, index)
        }
      }
      break
      
    case 'dest_ip':
      for (const index in verdicts) {
        if (verdicts[index].dest_ip == pattern) {
          loadLine(verdicts, index)
        }
      }
      break
      
    case 'dest_port':
      for (const index in verdicts) {
        if (verdicts[index].dest_port == pattern) {
          loadLine(verdicts, index)
        }
      }
      break
      
    case 'action':
      for (const index in verdicts) {
        if (verdicts[index].action == pattern) {
          loadLine(verdicts, index)
        }
      }
      break
      
    default:
      if (pattern != '' && name == 'all') {
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
      } else {
        loadVerdictTable()
      }
      break
  }
}

async function loadVerdictTableFilterRegex(pattern, key = 'all') {
  const verdicts = await get('verdicts')
  verdict_table_body.innerHTML = ''

  function isRegex(pattern) {

    if (pattern.startsWith('/') && pattern.endsWith('/')) {
      return true
    }
    return false

    // try {
    //   new RegExp(pattern)
    //   return true
    // } catch (e) {
    //   return false
    // }
  }

  function testPattern(key_value, pattern) {
    if (isRegex(pattern)) {
      const regex = new RegExp(pattern.slice(1,-1), 'i')
      return regex.test(key_value)
    }
    return pattern.toLowerCase().includes(key_value.toLowerCase())
  }

  switch (key) {
    case 'date':
      for (const index in verdicts) {
        if (testPattern(verdicts[index].date, pattern)){
          loadLine(verdicts, index)
        }
      }
      break
      
    case 'time':
      for (const index in verdicts) {
        if (testPattern(verdicts[index].time, pattern)) {
          loadLine(verdicts, index)
        }
      }
      break
      
    case 'source_ip':
      for (const index in verdicts) {
        if (testPattern(verdicts[index].source_ip, pattern)) {
          loadLine(verdicts, index)
        }
      }
      break
      
    case 'source_port':
      for (const index in verdicts) {
        if (testPattern(verdicts[index].source_port, pattern)) {
          loadLine(verdicts, index)
        }
      }
      break
      
    case 'dest_ip':
      for (const index in verdicts) {
        if (testPattern(verdicts[index].dest_ip, pattern)) {
          loadLine(verdicts, index)
        }
      }
      break
      
    case 'dest_port':
      for (const index in verdicts) {
        if (testPattern(verdicts[index].dest_port, pattern)) {
          loadLine(verdicts, index)
        }
      }
      break
      
    case 'action':
      for (const index in verdicts) {
        if (testPattern(verdicts[index].action, pattern)) {
          loadLine(verdicts, index)
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
            loadLine(verdicts, index)
          }
        }
      } else {
        loadVerdictTable()
      }
      break
  }
}

loadVerdictTable()

log_filter.oninput = (event) => {
  let parameters = log_filter.value.split('|')
  parameters = parameters.map(value => value.trim())

  loadVerdictTableFilter(parameters[0], parameters[1])
}

log_filter_regex.oninput = (event) => {
  let parameters = log_filter_regex.value.split('|')
  parameters = parameters.map(value => value.trim())

  loadVerdictTableFilterRegex(parameters[0], parameters[1])
}

// REMOVER PESQUISA POR STRING!!!!!!!!!!!!!1 REGEX CUMPRE O SEU PAPEL!!!!!