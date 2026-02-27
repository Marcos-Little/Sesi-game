const API_URL = "https://659fce55-7f63-4951-b3c5-f9b73ddb10a0-00-2tlr249v91xk0.picard.replit.dev";

const listaRanking = document.getElementById("listaRanking");
const podio = document.getElementById("podio");
const filtroTurma = document.getElementById("filtroTurma");
const btnVoltar = document.getElementById("btnVoltar");

let alunosCache = [];

async function buscarRanking() {
  const res = await fetch(`${API_URL}/alunos`);
  const alunos = await res.json();
  alunosCache = alunos;
  aplicarFiltro();
}

function ordenar(alunos) {
  return alunos.sort((a, b) => {
    if ((b.level ?? 1) !== (a.level ?? 1)) {
      return (b.level ?? 1) - (a.level ?? 1);
    }
    return (b.xp ?? 0) - (a.xp ?? 0);
  });
}

function aplicarFiltro() {
  const turma = filtroTurma.value;

  let filtrados = alunosCache;

  if (turma !== "GERAL") {
    filtrados = alunosCache.filter(a => a.turma === turma);
  }

  const ordenados = ordenar([...filtrados]);

  renderizarPodio(ordenados.slice(0, 3));
  renderizarLista(ordenados.slice(3));
}

function renderizarPodio(top3) {
  podio.innerHTML = "";

  const medalhas = ["🥇", "🥈", "🥉"];

  top3.forEach((aluno, i) => {
    const div = document.createElement("div");
    div.className = `podio-card podio-${i + 1}`;

    div.innerHTML = `
      <div style="font-size:22px">${medalhas[i]}</div>
      <img src="${aluno.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + aluno.usuario}">
      <h3>${aluno.nome}</h3>
      <small>${aluno.turma || "?"}</small>
      <div class="status">🔼 Lv ${aluno.level ?? 1}</div>
      <div class="status">⭐ XP ${aluno.xp ?? 0}</div>
    `;

    podio.appendChild(div);
  });
}

function renderizarLista(alunos) {
  listaRanking.innerHTML = "";

  alunos.forEach((aluno, index) => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${aluno.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + aluno.usuario}">
      <div>
        <strong>#${index + 4} - ${aluno.nome}</strong>
        <div class="status">Turma: ${aluno.turma || "-"}</div>
        <div class="status">🔼 Lv ${aluno.level ?? 1} | ⭐ XP ${aluno.xp ?? 0} | ❤️ HP ${aluno.hp ?? 100}</div>
      </div>
    `;

    listaRanking.appendChild(div);
  });
}

filtroTurma.addEventListener("change", aplicarFiltro);
btnVoltar.addEventListener("click", () => history.back());

buscarRanking();