let aluno = JSON.parse(localStorage.getItem("alunoLogado"));



const hpMax = 100;
const xpParaProximoLevel = 100;

// garante valores padrão
aluno.hp = aluno.hp ?? 100;
aluno.xp = aluno.xp ?? 0;
aluno.level = aluno.level ?? 1;

// 🔥 REGRA DE UPAR DE LEVEL
if (aluno.xp >= xpParaProximoLevel) {
  const levelsGanhados = Math.floor(aluno.xp / xpParaProximoLevel);
  aluno.level += levelsGanhados;
  aluno.xp = aluno.xp % xpParaProximoLevel;

  // salva atualizado
  localStorage.setItem("alunoLogado", JSON.stringify(aluno));
}

// renderiza na tela
document.getElementById("nome").textContent = aluno.nome;
document.getElementById("classe").textContent = aluno.classe || "Aventureiro";
document.getElementById("hp").textContent = aluno.hp;
document.getElementById("xp").textContent = aluno.xp;
document.getElementById("level").textContent = aluno.level;
document.getElementById("historia").textContent = aluno.historia || "Sua jornada está só começando...";
document.getElementById("avatar").src = aluno.avatar;

// barras
document.getElementById("barraHp").style.width =
  `${Math.max(0, Math.min(100, (aluno.hp / hpMax) * 100))}%`;

document.getElementById("barraXp").style.width =
  `${Math.max(0, Math.min(100, (aluno.xp / xpParaProximoLevel) * 100))}%`;

// sair
document.getElementById("btnSair").addEventListener("click", () => {
  localStorage.removeItem("alunoLogado");
  window.location.href = "login.html";
});
