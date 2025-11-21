import { get, loadLine} from './lib.js'

const table_body = document.getElementById('tables-table-body')
const search_input = document.getElementById('searchInput')
const family_filter = document.getElementById('familyFilter')
const reset_filters_btn = document.getElementById('btnReset')

async function tables_table_body() {
  const tables = await get('tables')
  
  table_body.innerHTML = ''

  for (const index in tables) {
    loadLine(tables, 'tables', index, table_body,
    ['name', 'family', 'description'] )
  }
}

tables_table_body()


async function applyFilters() {
    const tables = await get('tables')
    table_body.innerHTML = ''
    const search_family = family_filter.value
    if (search_family === 'all'){
        for (const index in tables) {
            loadLine(tables, 'tables', index, table_body,
            ['name', 'family', 'description'] )
        }
    }
    else if (search_family === 'inet'){
        for (const index in tables) {
            if (tables[index].family === 'inet'){
                loadLine(tables, 'tables', index, table_body,
                ['name', 'family', 'description'] )
            }
        }
    }
    else if (search_family === 'ip'){
        for (const index in tables){
            if (tables[index].family === 'ip'){
                loadLine(tables, 'tables', index, table_body,
                ['name', 'family', 'description']
                )
            }
        }
    }
    else if (search_family === 'ip6'){
        for (const index in tables){
            if (tables[index].family === 'ip6'){
                loadLine(tables, 'tables', index, table_body,
                ['name', 'family', 'description']
                )
            }
        }
    }
    else if (search_family === 'bridge'){
        for (const index in tables){
            if (tables[index].family === 'bridge'){
                loadLine(tables, 'tables', index, table_body,
                ['name', 'family', 'description']
                )
            }
        }
    }
    else if (search_family === 'arp'){
        for (const index in tables){
            if (tables[index].family === 'arp'){
                loadLine(tables, 'tables', index, table_body,
                ['name', 'family', 'description']
                )
            }
        }
    }
}

family_filter.addEventListener('change', applyFilters)


async function resetFilters() {
    filter_type.value = 'all'
    tables_table_body()
}
reset_filters_btn.addEventListener('click', resetFilters) 

oi