import { loadLine, testPattern, downloadResource } from '../../utils/lib.js'
import { getResource } from '../../api/apiClient.js'

const chain_body = document.getElementById('chainlist-table-body')
const filter_type = document.getElementById('filterType')
const reset_filters_btn = document.getElementById('btnReset')
const search_input = document.getElementById('searchInput')
const download_chains = document.getElementById('download-chains')

const chains_json = await getResource('chains')
const chains_keys = ['table_id', 'name', 'type', 'hook', 'priority', 'policy', 'description']

function loadChainTable() {
    chain_body.innerHTML = ''

    for (const index in chains_json) {
        loadLine(chains_json, 'chains', index, chain_body, chains_keys)
    }
}

loadChainTable()

function applyFilters() {
    chain_body.innerHTML = ''
    const search_type = filter_type.value
    if (search_type === 'all') {
        for (const index in chains_json) {
            loadLine(chains_json, 'chains', index, chain_body, chains_keys)
        }
    }
    else if (search_type === 'filter') {
        for (const index in chains_json) {
            if (chains_json[index].type === 'filter') {
                loadLine(chains_json, 'chains', index, chain_body, chains_keys)
            }
        }
    }
    else if (search_type === 'nat') {
        for (const index in chains_json) {
            if (chains_json[index].type === 'nat') {
                loadLine(chains_json, 'chains', index, chain_body, chains_keys)
            }
        }
    }
    else if (search_type === 'route') {
        for (const index in chains_json) {
            if (chains_json[index].type === 'route') {
                loadLine(chains_json, 'chains', index, chain_body, chains_keys)
            }
        }
    }
    else if (search_type === 'meter') {
        for (const index in chains_json) {
            if (chains_json[index].type === 'meter') {
                loadLine(chains_json, 'chains', index, chain_body, chains_keys)
            }
        }
    }
}

function loadChainsTableFilter(chains, pattern, key = 'all') {
    chain_body.innerHTML = ''

    switch (key) {
        case 'name':
            for (const index in chains) {
                if (testPattern(chains[index].name, pattern)) {
                    loadLine(chains_json, 'chains', index, chain_body, chains_keys)
                }
            }
            break

        case 'type':
            for (const index in chains) {
                if (testPattern(chains[index].type, pattern)) {
                    loadLine(chains_json, 'chains', index, chain_body, chains_keys)
                }
            }
            break

        case 'hook':
            for (const index in chains) {
                if (testPattern(chains[index].hook, pattern)) {
                    loadLine(chains_json, 'chains', index, chain_body, chains_keys)
                }
            }
            break

        case 'priority':
            for (const index in chains) {
                if (testPattern(chains[index].priority, pattern)) {
                    loadLine(chains_json, 'chains', index, chain_body, chains_keys)
                }
            }
            break

        case 'policy':
            for (const index in chains) {
                if (testPattern(chains[index].policy, pattern)) {
                    loadLine(chains_json, 'chains', index, chain_body, chains_keys)
                }
            }
            break

        case 'description':
            for (const index in chains) {
                if (testPattern(chains[index].description, pattern)) {
                    loadLine(chains_json, 'chains', index, chain_body, chains_keys)
                }
            }

        default:
            if (pattern != '' && key == 'all') {
                for (const index in chains) {
                    if (testPattern(chains[index].name, pattern) ||
                        testPattern(chains[index].type, pattern) ||
                        testPattern(chains[index].hook, pattern) ||
                        testPattern(chains[index].priority, pattern) ||
                        testPattern(chains[index].policy, pattern) ||
                        testPattern(chains[index].description, pattern)) {
                        loadLine(chains_json, 'chains', index, chain_body, chains_keys)
                    }
                }
            } else {
                loadChainTable()
            }
            break
    }
}

filter_type.addEventListener('change', applyFilters)

function resetFilters() {
    filter_type.value = 'all'
    loadChainTable()
}

reset_filters_btn.addEventListener('click', resetFilters)

search_input.oninput = (event) => {
    let parameters = search_input.value.split(';')
    parameters = parameters.map(value => value.trim())
    loadChainsTableFilter(chains_json, parameters[0], parameters[1])
}

download_chains.onclick = (event) => {
    downloadResource('chains')
}
