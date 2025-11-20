async function get(arg, id = '') {
	try {
		const response = await fetch(`http://localhost:3000/${arg}/${id}`);
		if (!response.ok) throw new Error(`Erro ao listar configuração de ${arg}`);
		const data = await response.json();
		console.table(data);
		return data;

	} catch (error) {
		console.error('Erro na requisição:', error)
		return null
	}
}

function loadLine(resource, resource_name, index, table_body_name, resource_keys) {
  const tr = document.createElement('tr')
  tr.id = `${resource_name}-tr-${index}`

  resource_keys.forEach(key => {
    const td = document.createElement('td')
    td.id = `${resource_name}-td-${key}-${index}`
    td.textContent = `${resource[index][key]}`
    tr.appendChild(td)
  })

  table_body_name.appendChild(tr)
}

async function downloadResource(resource_name) {
  const resource = await get(resource_name)
  const resource_json = JSON.stringify(resource, null, 2)
  const blob = new Blob([resource_json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${resource_name}.json`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export { get, loadLine, downloadResource }