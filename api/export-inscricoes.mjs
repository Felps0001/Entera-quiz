import { open, mkdir, unlink } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config({ path: fileURLToPath(new URL('.env', import.meta.url)), quiet: true });

// Protege textos digitados no formulário contra fórmulas ao abrir no Excel.
function csvCell(value) {
  let text = value == null ? '' : String(value);
  if (/^[\s]*[=+@-]/u.test(text) || /^[\t\r\n]/u.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

async function main() {
  if (process.argv.length > 3) throw new Error('Uso: npm run export:inscritos -- [arquivo.csv]');
  if (!process.env.MONGODB_URI) throw new Error('Configure MONGODB_URI no arquivo api/.env ou no ambiente.');

  const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
  const output = resolve(process.argv[2] || `exports/inscritos-${timestamp}.csv`);
  const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  let file;
  let complete = false;
  try {
    await client.connect();
    await mkdir(dirname(output), { recursive: true });
    // Nunca sobrescreve um arquivo existente.
    file = await open(output, 'wx');
    await file.writeFile('\uFEFFid;nome;crm;celular;estado;especialidade;data_inscricao_utc\r\n', 'utf8');
    const cursor = client.db(process.env.MONGODB_DB || 'entera').collection('inscricoes').find({}, {
      projection: { _id: 1, nome: 1, crm: 1, celular: 1, estado: 1, especialidade: 1, createdAt: 1 },
    }).sort({ _id: 1 });
    let count = 0;
    for await (const registration of cursor) {
      const date = registration.createdAt instanceof Date ? registration.createdAt.toISOString() : registration.createdAt;
      const values = [registration._id, registration.nome, registration.crm, registration.celular, registration.estado, registration.especialidade, date];
      await file.writeFile(`${values.map(csvCell).join(';')}\r\n`, 'utf8');
      count++;
    }
    await file.close();
    complete = true;
    console.log(`${count} inscrição(ões) exportada(s): ${output}`);
  } finally {
    if (file && !complete) {
      await file.close().catch(() => {});
      await unlink(output).catch(() => {});
    }
    await client.close();
  }
}

main().catch(error => {
  // Evita expor a string de conexão e credenciais nas mensagens do driver.
  if (error.code === 'EEXIST') console.error('O arquivo de destino já existe. Escolha outro nome.');
  else if (error.name === 'Error') console.error(error.message);
  else console.error(`Falha na exportação (${error.code || error.name}). Verifique a conexão, as permissões e o acesso de rede ao MongoDB.`);
  process.exitCode = 1;
});
