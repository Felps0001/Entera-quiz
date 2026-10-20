import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { validateRegistration } from './validation.js';

export function createApp({ collection, origins, trustProxy = false }) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', trustProxy);
  app.use(helmet());
  app.use((req, res, next) => {
    if (req.headers.origin && !origins.includes(req.headers.origin)) return res.status(403).json({ message: 'Origem não permitida.' });
    next();
  });
  app.use(cors({ origin: origins, methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
  app.use(express.json({ limit: '8kb' }));
  app.get('/health', async (_req, res) => {
    try { await collection.db.command({ ping: 1 }); res.json({ status: 'ok' }); }
    catch { res.status(503).json({ status: 'unavailable' }); }
  });
  app.post('/api/inscricoes', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Muitas tentativas. Aguarde alguns minutos para tentar novamente.' } }), async (req, res, next) => {
    const { data, error } = validateRegistration(req.body);
    if (error) return res.status(400).json({ message: error });
    try {
      await collection.insertOne({ ...data, createdAt: new Date() });
      res.status(201).json({ message: 'Inscrição realizada com sucesso.' });
    } catch (err) {
      if (err.code === 11000) return res.status(409).json({ message: 'Já existe uma inscrição para este CRM e estado.' });
      next(err);
    }
  });
  app.use((_req, res) => res.status(404).json({ message: 'Rota não encontrada.' }));
  app.use((err, _req, res, _next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'JSON inválido.' });
    if (err.type === 'entity.too.large') return res.status(413).json({ message: 'Dados excedem o tamanho permitido.' });
    console.error('Falha na API:', err.name, err.code || '');
    res.status(503).json({ message: 'Não foi possível salvar sua inscrição. Tente novamente em instantes.' });
  });
  return app;
}
