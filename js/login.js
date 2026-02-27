const btnLogin = document.getElementById("btnLogin");
const erro = document.getElementById("erro");

// 👇 sua URL do Replit
const API_URL = "https://api-rpg-yeo4.onrender.com";

btnLogin.addEventListener("click", async () => {
  const usuario = document.getElementById("login").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!usuario || !senha) {
    erro.textContent = "Preencha usuário e senha!";
    return;
  }

  try {
    // 1️⃣ tenta como aluno
    let response = await fetch(
      `${API_URL}/alunos?usuario=${encodeURIComponent(usuario)}&senha=${encodeURIComponent(senha)}`
    );
    let dados = await response.json();

    if (Array.isArray(dados) && dados.length > 0) {
      localStorage.setItem("alunoLogado", JSON.stringify(dados[0]));
      localStorage.removeItem("professorLogado");

      // 👉 NOVA REGRA: se não criou personagem, vai pra criação
      if (!dados[0].personagemCriado) {
        window.location.href = "criar-personagem.html";
      } else {
        window.location.href = "personagem.html";
      }
      return;
    }

    // 2️⃣ tenta como professor
    response = await fetch(
      `${API_URL}/professores?usuario=${encodeURIComponent(usuario)}&senha=${encodeURIComponent(senha)}`
    );
    dados = await response.json();

    if (Array.isArray(dados) && dados.length > 0) {
      localStorage.setItem("professorLogado", JSON.stringify(dados[0]));
      localStorage.removeItem("alunoLogado");
      window.location.href = "professor.html";
      return;
    }

    // 3️⃣ nenhum dos dois
    erro.textContent = "Usuário ou senha inválidos!";

  } catch (e) {
    erro.textContent = "Erro ao conectar com a API REST!";
    console.error(e);
  }
});