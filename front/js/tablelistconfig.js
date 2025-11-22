import { get, loadLine} from './lib.js'

const table_body = document.getElementById('tables-table-body')
const search_input = document.getElementById('searchInput')
const family_filter = document.getElementById('familyFilter')
const reset_filters_btn = document.getElementById('btnReset')
const search_qtd = document.getElementById('totalCount')
const qtd_filter = document.getElementById('filteredCount')
const search_button = document.getElementById('btnSearch')

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
    family_filter.value = 'all'
    tables_table_body()
}
reset_filters_btn.addEventListener('click', resetFilters) 

async function applycount() {
    const tables = await get ('tables')
    let count = 0
    for (const index in tables){
        count += 1
    }
    search_qtd.innerText = count
}

applycount()

async function applycountfilter() {
    const tables = await get ('tables')
    let count = 0
    const search_family = family_filter.value
    if (search_family === 'all'){
        for (const index in tables) {
            count += 1
        }
        
    }
    else {
        for (const index in tables){
            if (tables[index].family === search_family){
                count += 1
            }
        }
    }
    qtd_filter.innerText = count
}

family_filter.addEventListener('change', applycountfilter) 
reset_filters_btn.addEventListener('click', applycountfilter)


async function searchTables() {
    const tables = await get('tables')
    const search_term = search_input.value.toLowerCase()
    table_body.innerHTML = ''
    for (const index in tables) {
        if (tables[index].name.toLowerCase().includes(search_term) ||
            tables[index].family.toLowerCase().includes(search_term) ||
            tables[index].description.toLowerCase().includes(search_term)) {
            loadLine(tables, 'tables', index, table_body,
            ['name', 'family', 'description'])
        }
        
    }
    
}

search_button.addEventListener('click', searchTables)

async function search_name_qtd(){
    const tables = await get('tables')
    const search_term = search_input.value.toLowerCase()
    let count = 0
    for (const index in tables) {
        if (tables[index].name.toLowerCase().includes(search_term) ||
            tables[index].family.toLowerCase().includes(search_term) ||
            tables[index].description.toLowerCase().includes(search_term)) {
            count += 1
        }

    }
    qtd_filter.innerText = count
}

search_button.addEventListener('click', search_name_qtd)

