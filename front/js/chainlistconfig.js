import { get, loadLine} from './lib.js'

const chain_body = document.getElementById('chainlist-table-body')
const filter_type = document.getElementById('filterType')
const reset_filters_btn = document.getElementById('btnReset')


async function chain_table_body() {
  const chains = await get('chains')
  
  chain_body.innerHTML = ''

  for (const index in chains) {
    loadLine(chains, 'chains', index, chain_body,
    ['name', 'type', 'hook', 'priority', 'policy', 'description'])
  }
}

chain_table_body()

async function applyFilters() {
    const chains = await get('chains')
    chain_body.innerHTML = ''
    const search_type = filter_type.value
    if (search_type === 'all'){
        for (const index in chains) {
            loadLine(chains, 'chains', index, chain_body,
            ['name', 'type', 'hook', 'priority', 'policy', 'description'] )
        }
    }
    else if (search_type === 'filter'){
        for (const index in chains){ {
            if (chains[index].type === 'filter'){
                loadLine(chains, 'chains', index, chain_body,
                ['name', 'type', 'hook', 'priority', 'policy', 'description'] )
            }
        }
      }
    }
    else if (search_type === 'nat'){
        for (const index in chains){
            if (chains[index].type === 'nat'){
                loadLine(chains, 'chains', index, chain_body,
                ['name', 'type', 'hook', 'priority', 'policy', 'description']
                )
            }
        }
    }
    else if (search_type === 'route'){
        for (const index in chains){
            if (chains[index].type === 'route'){
                loadLine(chains, 'chains', index, chain_body,
                ['name', 'type', 'hook', 'priority', 'policy', 'description']
                )
            }
        }
    }
    else if (search_type === 'meter'){
        for (const index in chains){
            if (chains[index].type === 'meter'){
                loadLine(chains, 'chains', index, chain_body,
                ['name', 'type', 'hook', 'priority', 'policy', 'description']
                )
            }
        }
    }
}


filter_type.addEventListener('change', applyFilters)

async function resetFilters() {
    chain_table_body()
}

reset_filters_btn.addEventListener('click', resetFilters)


