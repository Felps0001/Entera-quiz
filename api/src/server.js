import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { createApp } from './app.js';

if (!process.env.MONGODB_URI) throw new Error('Configure MONGODB_URI no ambiente da API.');
const origins = (process.env.FRONTEND_ORIGINS || 'http://localhost:5173').split(',').map(s => s.trim()).filter(Boolean);
const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
await client.connect();
const db = client.db(process.env.MONGODB_DB || 'entera');
const registrations = db.collection('inscricoes');
await registrations.createIndex({ crm: 1, estado: 1 }, { unique: true });
const app = createApp({ collection: { insertOne: data => registrations.insertOne(data), db }, origins, trustProxy: process.env.TRUST_PROXY ? Number(process.env.TRUST_PROXY) : false });
const server = app.listen(Number(process.env.PORT || 3001), '0.0.0.0', () => console.log('API de inscrições iniciada.'));
function shutdown() { server.close(() => client.close().then(() => process.exit(0))); }
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
