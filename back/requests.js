export async function get(arg, id = '') {

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