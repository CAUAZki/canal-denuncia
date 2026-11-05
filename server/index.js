import express from 'express';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { attachUser } from './lib/session.js';
import { publicRouter } from './routes/public.js';
import { authRouter } from './routes/auth.js';
import { panelRouter } from './routes/panel.js';

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(attachUser);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'canal-seguro-ia' });
});

app.use('/api', publicRouter);
app.use('/api/auth', authRouter);
app.use('/api/panel', panelRouter);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Recurso não encontrado.' });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'O anexo deve ter no máximo 5 MB.'
      : 'Não foi possível processar o anexo enviado.';
    return res.status(400).json({ error: message });
  }
  console.error('[api] erro inesperado:', err);
  return res.status(500).json({ error: 'Não foi possível concluir a operação. Tente novamente em instantes.' });
});

const port = Number(process.env.PORT) || 8000;
app.listen(port, '0.0.0.0', () => {
  console.log(`[api] Canal Seguro IA ouvindo em 0.0.0.0:${port}`);
});
