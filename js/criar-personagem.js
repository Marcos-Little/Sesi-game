// criar-personagem.js

const API_URL = "https://659fce55-7f63-4951-b3c5-f9b73ddb10a0-00-2tlr249v91xk0.picard.replit.dev";

// 1️⃣ Pega aluno logado
const aluno = JSON.parse(localStorage.getItem("alunoLogado"));

if (!aluno) {
  alert("Sessão expirada. Faça login novamente.");
  window.location.href = "login.html";
}

// 2️⃣ Bloqueia refazer personagem
if (aluno.personagemCriado) {
  alert("Você já criou seu personagem!");
  window.location.href = "personagem.html";
}

// 3️⃣ Gera avatar automático (DiceBear)
function gerarAvatar(nome, classe, genero) {
  const seed = encodeURIComponent(`${nome}-${classe}-${genero}`);
  const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
  const avatarFull = `https://api.dicebear.com/7.x/adventurer-full-body/svg?seed=${seed}`;
  return { avatar, avatarFull };
}

// 4️⃣ Salva no banco (PUT pra não dar erro no json-server)
async function salvarPersonagem(dados) {
  const res = await fetch(`${API_URL}/alunos/${aluno.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...aluno,
      ...dados,
      hp: aluno.hp ?? 100,
      xp: aluno.xp ?? 0,
      level: aluno.level ?? 1
    })
  });

  if (!res.ok) {
    throw new Error("Erro ao salvar personagem");
  }

  const atualizado = await res.json();
  localStorage.setItem("alunoLogado", JSON.stringify(atualizado)); // mantém sincronizado
  return atualizado;
}

// 5️⃣ Clique no botão Criar Personagem
document.getElementById("btnCriar").addEventListener("click", async () => {
  const classe = document.getElementById("classe").value;
  const genero = document.getElementById("genero").value;
  const historia = document.getElementById("historia").value.trim();

  if (!classe || !genero) {
    alert("Escolha a classe e o gênero!");
    return;
  }

  try {
    const { avatar, avatarFull } = gerarAvatar(aluno.nome, classe, genero);

    await salvarPersonagem({
      classe,
      genero,
      historia,
      avatar,
      avatarFull,
      personagemCriado: true
    });

    alert("🎉 Personagem criado com sucesso!");
    window.location.href = "personagem.html";

  } catch (e) {
    console.error(e);
    alert("Erro ao criar personagem. Verifique se a API está rodando.");
  }
});