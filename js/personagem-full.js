const aluno = JSON.parse(localStorage.getItem("alunoSelecionado"));

if (!aluno) {
  history.back(); // ou personagem.html
}

document.getElementById("nome").textContent = aluno.nome;
document.getElementById("hp").textContent = aluno.hp ?? 100;
document.getElementById("xp").textContent = aluno.xp ?? 0;
document.getElementById("level").textContent = aluno.level ?? 1;
document.getElementById("classe").textContent = aluno.classe || "Aventureiro";
document.getElementById("historia").textContent = aluno.historia || "Um herói em treinamento...";

document.getElementById("avatarFull").src = aluno.avatarFull;
document.getElementById("btnVoltar").addEventListener("click", () => {
  history.back();
});
