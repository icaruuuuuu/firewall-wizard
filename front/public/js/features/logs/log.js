import { loadLine, downloadResource, testPattern } from '../../utils/lib.js'
import { getResource } from '../../api/apiClient.js'

const log_table_body = document.getElementById('log-table-body')
const log_filter = document.getElementById('log-filter')
const download_log = document.getElementById('download-log')
const log_count = document.getElementById('log-count')
const logs_json = await getResource('logs') // pensar em otimização/praticidade: assim so atualiza o log no front ao carregar a pagina
const log_keys = ['date', 'time', 'source_ip', 'source_port', 'dest_ip', 'dest_port', 'action']

function loadLogTable(logs) {
  log_table_body.innerHTML = ''

  for (const index in logs) {
    loadLine(logs, 'logs', index, log_table_body, log_keys)
  }
}

function loadLogTableFilter(logs, pattern, key = 'all') {
  log_table_body.innerHTML = ''

  switch (key) {
    case 'date':
      for (const index in logs) {
        if (testPattern(logs[index].date, pattern)) {
          loadLine(logs, 'logs', index, log_table_body, log_keys)
        }
      }
      break

    case 'time':
      for (const index in logs) {
        if (testPattern(logs[index].time, pattern)) {
          loadLine(logs, 'logs', index, log_table_body, log_keys)
        }
      }
      break

    case 'source_ip':
      for (const index in logs) {
        if (testPattern(logs[index].source_ip, pattern)) {
          loadLine(logs, 'logs', index, log_table_body, log_keys)
        }
      }
      break

    case 'source_port':
      for (const index in logs) {
        if (testPattern(logs[index].source_port, pattern)) {
          loadLine(logs, 'logs', index, log_table_body, log_keys)
        }
      }
      break

    case 'dest_ip':
      for (const index in logs) {
        if (testPattern(logs[index].dest_ip, pattern)) {
          loadLine(logs, 'logs', index, log_table_body, log_keys)
        }
      }
      break

    case 'dest_port':
      for (const index in logs) {
        if (testPattern(logs[index].dest_port, pattern)) {
          loadLine(logs, 'logs', index, log_table_body, log_keys)
        }
      }
      break

    case 'action':
      for (const index in logs) {
        if (testPattern(logs[index].action, pattern)) {
          loadLine(logs, 'logs', index, log_table_body, log_keys)
        }
      }
      break

    default:
      if (pattern != '' && key == 'all') {
        for (const index in logs) {
          if (testPattern(logs[index].date, pattern) ||
            testPattern(logs[index].time, pattern) ||
            testPattern(logs[index].source_ip, pattern) ||
            testPattern(logs[index].source_port, pattern) ||
            testPattern(logs[index].dest_ip, pattern) ||
            testPattern(logs[index].dest_port, pattern) ||
            testPattern(logs[index].action, pattern)) {
            loadLine(logs, 'logs', index, log_table_body, log_keys)
          }
        }
      } else {
        loadLogTable(logs_json)
      }
      break
  }
}

function calculateLogEntries() {
  log_count.innerText = `${log_table_body.childElementCount} entries`
}

function loadStart() {
  loadLogTable(logs_json)
  calculateLogEntries()
}

// Event listeners
log_filter.oninput = (event) => {
  let parameters = log_filter.value.split(';')
  parameters = parameters.map(value => value.trim())
  loadLogTableFilter(logs_json, parameters[0], parameters[1])
  calculateLogEntries()
}

download_log.onclick = (event) => {
  downloadResource('logs')
}

loadStart()
