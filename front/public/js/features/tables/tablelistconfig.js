import { loadLine, testPattern, downloadResource } from '../../utils/lib.js'
import { getResource } from '../../api/apiClient.js'

const table_body = document.getElementById('tables-table-body')
const search_input = document.getElementById('searchInput')
const family_filter = document.getElementById('familyFilter')
const reset_filters_btn = document.getElementById('btnReset')
const search_qtd = document.getElementById('totalCount')
const qtd_filter = document.getElementById('filteredCount')
const download_tables = document.getElementById('download-tables')

const tables_json = await getResource('tables')
const tables_keys = ['name', 'family', 'description']

function loadTableTable() {
    table_body.innerHTML = ''

    for (const index in tables_json) {
        loadLine(tables_json, 'tables', index, table_body, tables_keys)
    }
}

loadTableTable()


function applyFilters() {
    table_body.innerHTML = ''
    const search_family = family_filter.value
    if (search_family === 'all') {
        for (const index in tables_json) {
            loadLine(tables_json, 'tables', index, table_body, tables_keys)
        }

    }
    else if (search_family === 'inet') {
        for (const index in tables_json) {
            if (tables_json[index].family === 'inet') {
                loadLine(tables_json, 'tables', index, table_body, tables_keys)
            }
        }

    }
    else if (search_family === 'ip') {
        for (const index in tables_json) {
            if (tables_json[index].family === 'ip') {
                loadLine(tables_json, 'tables', index, table_body, tables_keys)
            }
        }
    }
    else if (search_family === 'ip6') {
        for (const index in tables_json) {
            if (tables_json[index].family === 'ip6') {
                loadLine(tables_json, 'tables', index, table_body, tables_keys)
            }
        }

    }
    else if (search_family === 'bridge') {
        for (const index in tables_json) {
            if (tables_json[index].family === 'bridge') {
                loadLine(tables_json, 'tables', index, table_body, tables_keys)
            }
        }

    }
    else if (search_family === 'arp') {
        for (const index in tables_json) {
            if (tables_json[index].family === 'arp') {
                loadLine(tables_json, 'tables', index, table_body,
                    ['name', 'family', 'description']
                )
            }
        }
    }
}

function loadTablesTableFilter(tables, pattern, key = 'all') {
    table_body.innerHTML = ''

    switch (key) {
        case 'name':
            for (const index in tables) {
                if (testPattern(tables[index].name, pattern)) {
                    loadLine(tables, 'tables', index, table_body, tables_keys)
                }
            }
            break

        case 'family':
            for (const index in tables) {
                if (testPattern(tables[index].family, pattern)) {
                    loadLine(tables, 'tables', index, table_body, tables_keys)
                }
            }
            break

        case 'description':
            for (const index in tables) {
                if (testPattern(tables[index].description, pattern)) {
                    loadLine(tables, 'tables', index, table_body, tables_keys)
                }
            }

        default:
            if (pattern != '' && key == 'all') {
                for (const index in tables) {
                    if (testPattern(tables[index].name, pattern) ||
                        testPattern(tables[index].family, pattern) ||
                        testPattern(tables[index].description, pattern)) {
                        loadLine(tables, 'tables', index, table_body, tables_keys)
                    }
                }
            } else {
                loadTableTable()
            }
            break
    }
}

function applycountfilter() {
    let count = 0
    const search_family = family_filter.value
    if (search_family === 'all') {
        for (const index in tables_json) {
            count += 1
        }

    }
    else {
        for (const index in tables_json) {
            if (tables_json[index].family === search_family) {
                count += 1
            }
        }
    }
    qtd_filter.innerText = count
}

family_filter.addEventListener('change', applycountfilter)
// reset_filters_btn.addEventListener('click', applycountfilter)
reset_filters_btn.onclick = (event) => {
    resetFilters()
    applycountfilter()
}

family_filter.addEventListener('change', applyFilters)


function resetFilters() {
    family_filter.value = 'all'
    loadTableTable()
}

// reset_filters_btn.addEventListener('click', resetFilters)

function applyCount() {
    let count = 0
    for (const index in tables_json) {
        count += 1
    }
    search_qtd.innerText = count
}

applyCount()
applycountfilter()

search_input.oninput = (event) => {
    let parameters = search_input.value.split(';')
    parameters = parameters.map(value => value.trim())
    loadTablesTableFilter(tables_json, parameters[0], parameters[1])
}

download_tables.onclick = (event) => {
    downloadResource('tables')
}