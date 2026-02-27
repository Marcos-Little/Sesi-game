import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const app = express();
app.use(cors());
app.use(express.json());

const adapter = new JSONFile("bd.json");

// 🔥 AQUI está a correção: passar o objeto padrão
const defaultData = {
  alunos: [],
  professores: []
};

const db = new Low(adapter, defaultData);

// sempre ler o banco ao iniciar
await db.read();

// se o arquivo estiver vazio, aplica o padrão
db.data ||= defaultData;

// ================== ROTAS ==================

app.get("/alunos", async (req, res) => {
  await db.read();
  res.json(db.data.alunos);
});

app.patch("/alunos/:id", async (req, res) => {
  const { id } = req.params;
  await db.read();

  const aluno = db.data.alunos.find(a => a.id == id);
  if (!aluno) return res.status(404).json({ error: "Aluno não encontrado" });

  Object.assign(aluno, req.body);
  await db.write();

  res.json(aluno);
});

app.get("/professores", async (req, res) => {
  await db.read();
  res.json(db.data.professores);
});

app.post("/alunos", async (req, res) => {
  await db.read();
  db.data.alunos.push(req.body);
  await db.write();
  res.status(201).json(req.body);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 API RPG rodando na porta " + PORT);
});