async function get(arg, id) {
	const response = await fetch(`https://localhost:8000/${arg}/${id}`);
	if (!response.ok) throw new Error(`Erro ao listar configuração de ${arg}`);
	const data = await response.json();
	console.table(data);
	return data;
}
