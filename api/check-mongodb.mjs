import fs from 'node:fs';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import { createApp } from './src/app.js';

const config = dotenv.parse(fs.readFileSync(new URL('./.env', import.meta.url)));
const client = new MongoClient(config.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
const id = new ObjectId();
let collection;
let server;
try {
  await client.connect();
  const db = client.db(config.MONGODB_DB || 'entera');
  collection = db.collection('inscricoes');
  await collection.createIndex({ crm: 1, estado: 1 }, { unique: true });
  const app = createApp({ collection: { db, insertOne: data => collection.insertOne({ ...data, _id: id }) }, origins: ['http://localhost:5173'] });
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const endpoint = `http://127.0.0.1:${server.address().port}`;
  const health = await fetch(`${endpoint}/health`);
  if (!health.ok) throw new Error('Health check falhou.');
  // Identidade de teste isolada; nenhuma inscrição existente é alterada.
  const response = await fetch(`${endpoint}/api/inscricoes`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:5173' },
    body: JSON.stringify({ nome: 'Teste técnico de conexão Entera', crm: String(10000000 + Math.floor(Math.random() * 89999999)), estado: 'AC', celular: '11999990000', especialidade: 'Teste técnico — remover' }),
  });
  if (response.status !== 201) throw new Error(`Cadastro de teste retornou HTTP ${response.status}.`);
  if (!await collection.findOne({ _id: id })) throw new Error('Gravação não localizada no banco.');
  console.log('Conexão, índice único, health check e cadastro via API confirmados no MongoDB.');
} catch (error) {
  // Não imprimir mensagens do driver, pois podem conter partes da conexão.
  console.error('Verificação falhou:', error.name, 'código:', error.code || 'indisponível');
  process.exitCode = 1;
} finally {
  if (collection) {
    try {
      const result = await collection.deleteOne({ _id: id });
      if (result.deletedCount) console.log('Cadastro de teste removido.');
    } catch { console.error('Não foi possível confirmar a limpeza do cadastro técnico.'); process.exitCode = 1; }
  }
  if (server) await new Promise(resolve => server.close(resolve));
  await client.close();
}
