import fs from "fs";
import path from "path";

let lockMap = new Map();

async function withLock(key, fn) {
  while (lockMap.get(key)) {
    await new Promise(r => setTimeout(r, 10));
  }
  lockMap.set(key, true);
  try {
    return await fn();
  } finally {
    lockMap.set(key, false);
  }
}

export const TIPOS_MAP = {
  TEXTO: "string",
  NUMERO: "number",
  BOOLEANO: "boolean",
  DATA: "string",
  QUALQUER: "any",
};

let nextIds = new Map();

export function criarRepositorio(nomeTabela, props, diretorio) {
  const dir = diretorio || process.cwd();
  const dbFile = path.join(dir, `${nomeTabela}.json`);
  const backupFile = dbFile + ".bak";

  let dados = [];
  if (fs.existsSync(dbFile)) {
    try {
      dados = JSON.parse(fs.readFileSync(dbFile, "utf-8"));
    } catch (e) {
      try {
        const bak = fs.readFileSync(backupFile, "utf-8");
        dados = JSON.parse(bak);
        fs.writeFileSync(dbFile, bak, "utf-8");
        console.warn(`   Backup restaurado para ${nomeTabela}.json`);
      } catch {
        dados = [];
        fs.writeFileSync(dbFile, "[]", "utf-8");
      }
    }
  } else {
    fs.writeFileSync(dbFile, "[]", "utf-8");
  }

  let salvarQueue = Promise.resolve();
  function salvar() {
    salvarQueue = salvarQueue.then(() => {
      try {
        if (fs.existsSync(dbFile)) {
          fs.copyFileSync(dbFile, backupFile);
        }
        fs.writeFileSync(dbFile, JSON.stringify(dados, null, 2), "utf-8");
      } catch (e) {
        console.error(`   Erro ao salvar ${nomeTabela}: ${e.message}`);
      }
    });
    return salvarQueue;
  }

  if (!nextIds.has(nomeTabela)) {
    const maxId = dados.reduce((m, d) => Math.max(m, d.id || 0), 0);
    nextIds.set(nomeTabela, maxId);
  }

  function gerarId() {
    const id = (nextIds.get(nomeTabela) || 0) + 1;
    nextIds.set(nomeTabela, id);
    return id;
  }

  function validar(entrada, parcial = false) {
    const erros = [];
    for (const p of props) {
      const val = entrada[p.name];
      if (val === undefined && !parcial) {
        erros.push(`Campo "${p.name}" (${p.type}) é obrigatório`);
        continue;
      }
      if (val === undefined) continue;

      const tipoEsperado = TIPOS_MAP[p.type] || "any";
      if (tipoEsperado === "string" && typeof val !== "string") {
        erros.push(`Campo "${p.name}" espera TEXTO, recebeu ${typeof val}`);
      } else if (tipoEsperado === "number" && typeof val !== "number") {
        erros.push(`Campo "${p.name}" espera NUMERO, recebeu ${typeof val}`);
      } else if (tipoEsperado === "boolean" && typeof val !== "boolean") {
        erros.push(`Campo "${p.name}" espera BOOLEANO, recebeu ${typeof val}`);
      }
    }
    return erros;
  }

  return {
    async criar(entrada) {
      const erros = validar(entrada);
      if (erros.length > 0) throw new Error("Erros de validação:\n" + erros.join("\n"));
      const item = { id: gerarId(), ...entrada, criadoEm: new Date().toISOString() };
      dados.push(item);
      await salvar();
      return item;
    },

    listar() {
      return [...dados];
    },

    buscar(id) {
      return dados.find(d => d.id === id) || null;
    },

    async atualizar(id, mudancas) {
      const idx = dados.findIndex(d => d.id === id);
      if (idx === -1) throw new Error(`Registro ${id} não encontrado em ${nomeTabela}`);
      const erros = validar(mudancas, true);
      if (erros.length > 0) throw new Error("Erros de validação:\n" + erros.join("\n"));
      dados[idx] = { ...dados[idx], ...mudancas, atualizadoEm: new Date().toISOString() };
      await salvar();
      return dados[idx];
    },

    async deletar(id) {
      const idx = dados.findIndex(d => d.id === id);
      if (idx === -1) throw new Error(`Registro ${id} não encontrado em ${nomeTabela}`);
      const removido = dados.splice(idx, 1)[0];
      await salvar();
      return removido;
    },

    buscarOnde(filtro) {
      return dados.filter(d => {
        for (const [k, v] of Object.entries(filtro)) {
          if (d[k] !== v) return false;
        }
        return true;
      });
    },

    select(campos) {
      return dados.map(d => {
        const obj = {};
        for (const c of campos) obj[c] = d[c];
        return obj;
      });
    },

    contar() {
      return dados.length;
    },

    async limpar() {
      dados = [];
      await salvar();
    },
  };
}
