const API_URL = "https://659fce55-7f63-4951-b3c5-f9b73ddb10a0-00-2tlr249v91xk0.picard.replit.dev";

const listaAlunos = document.getElementById("listaAlunos");
const btnDarXpTodos = document.getElementById("btnDarXpTodos");
const btnTirarHpTodos = document.getElementById("btnTirarHpTodos");

const XP_PARA_PROXIMO_LEVEL = 100;

async function buscarAlunos() {
  const res = await fetch(`${API_URL}/alunos`);
  const alunos = await res.json();
  renderizarAlunos(alunos);
}

function aplicarLevelUp(aluno, xpNovo) {
  let xp = xpNovo ?? 0;
  let level = aluno.level ?? 1;

  if (xp >= XP_PARA_PROXIMO_LEVEL) {
    const levelsGanhados = Math.floor(xp / XP_PARA_PROXIMO_LEVEL);
    level += levelsGanhados;
    xp = xp % XP_PARA_PROXIMO_LEVEL;
  }

  return { xp, level };
}

function renderizarAlunos(alunos) {
  listaAlunos.innerHTML = "";

  alunos.forEach(aluno => {
    const hp = aluno.hp ?? 100;
    const xp = aluno.xp ?? 0;
    const level = aluno.level ?? 1;

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
  <img 
    src="${aluno.avatar}"
    class="avatar"
    title="Ver personagem"
  />
  <h3>${aluno.nome}</h3>
  <div class="status">❤️ HP: ${hp}</div>
  <div class="status">⭐ XP: ${xp}/100</div>
  <div class="status">🔼 Level: ${level}</div>

  <div class="acoes">
    <button class="btn-xp">+10 XP</button>
    <button class="btn-hp">-10 HP</button>
  </div>
`;
    div.querySelector(".avatar").addEventListener("click", () => {
      localStorage.setItem("alunoSelecionado", JSON.stringify(aluno));
      window.location.href = "personagem-full.html";
    });

    div.querySelector(".btn-xp").addEventListener("click", () => {
      const novoXpBruto = xp + 10;
      const { xp: xpFinal, level: levelFinal } = aplicarLevelUp(aluno, novoXpBruto);
      atualizarAluno(aluno, { xp: xpFinal, level: levelFinal });
    });

    div.querySelector(".btn-hp").addEventListener("click", () => {
      atualizarAluno(aluno, { hp: Math.max(0, hp - 10) });
    });

    listaAlunos.appendChild(div);
  });
}

async function atualizarAluno(aluno, changes) {
  const body = {
    ...aluno,
    ...changes
  };

  await fetch(`${API_URL}/alunos/${aluno.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  buscarAlunos();
}

// 🔥 Ações em massa
btnDarXpTodos.addEventListener("click", async () => {
  const valor = Number(document.getElementById("valorXp").value || 0);
  if (valor <= 0) return alert("Informe um valor de XP válido!");

  const res = await fetch(`${API_URL}/alunos`);
  const alunos = await res.json();

  await Promise.all(alunos.map(aluno => {
    const xpAtual = aluno.xp ?? 0;
    const levelAtual = aluno.level ?? 1;

    const { xp: xpFinal, level: levelFinal } =
      aplicarLevelUp(aluno, xpAtual + valor);

    return fetch(`${API_URL}/alunos/${aluno.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...aluno,
        xp: xpFinal,
        level: levelFinal
      })
    });
  }));

  buscarAlunos();
});

btnTirarHpTodos.addEventListener("click", async () => {
  const valor = Number(document.getElementById("valorHp").value || 0);
  if (valor <= 0) return alert("Informe um valor de HP válido!");

  const res = await fetch(`${API_URL}/alunos`);
  const alunos = await res.json();

  await Promise.all(alunos.map(aluno => {
    const novoHp = Math.max(0, (aluno.hp ?? 100) - valor);

    return fetch(`${API_URL}/alunos/${aluno.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...aluno,
        hp: novoHp
      })
    });
  }));

  buscarAlunos();
});

// Inicializa
buscarAlunos();
