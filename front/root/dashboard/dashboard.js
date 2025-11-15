import Chart from "https://cdn.jsdelivr.net/npm/chart.js";



// KPIs
function loadKPIs() {
document.getElementById("tablesCount").innerText = mock.tables.length;
document.getElementById("chainsCount").innerText = mock.chains.length;
document.getElementById("rulesCount").innerText = mock.rules.length;
document.getElementById("setsCount").innerText = mock.sets.length;
document.getElementById("dropsToday").innerText = 14;
document.getElementById("acceptsToday").innerText = 32;
}


// Listagem
function loadLists() {
mock.tables.forEach(t => addItem("tablesList", t));
mock.chains.forEach(c => addItem("chainsList", c));
mock.rules.forEach(r => addItem("rulesList", r));
mock.sets.forEach(s => addItem("setsList", s));


mock.logs.forEach(log => {
const row = document.createElement("tr");
row.innerHTML = `<td>${log.hora}</td><td>${log.acao}</td><td>${log.chain}</td><td>${log.proto}</td><td>${log.porta}</td><td>${log.src}</td><td>${log.dst}</td>`;
document.getElementById("logsTable").appendChild(row);
});
}


function addItem(id, text) {
const li = document.createElement("li");
li.innerText = text;
document.getElementById(id).appendChild(li);
}


// Gráfico de tráfego (mock)
function renderTraffic() {
new Chart(document.getElementById("trafficChart"), {
type: "line",
data: {
labels: ["10:00", "10:05", "10:10", "10:15", "10:20"],
datasets: [{
label: "Mbps",
data: [5, 8, 6, 12, 7],
borderColor: "#7c3aed",
backgroundColor: "rgba(167,139,250,0.4)",
}]
},
options: { responsive: true }
});
}


// Gráfico de portas mais acessadas
function renderPortChart() {
new Chart(document.getElementById("portChart"), {
type: "bar",
data: {
labels: ["80", "443", "22", "53", "3306"],
datasets: [{
label: "Acessos",
data: [420, 380, 250, 180, 90],
backgroundColor: "rgba(167,139,250,0.7)",
borderColor: "#6d28d9",
borderWidth: 1
}]
},
options: {
responsive: true
}
});
}


// Inicialização
loadKPIs();
loadLists();
renderTraffic();
renderPortChart();
