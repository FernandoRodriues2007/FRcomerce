import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './api/routes/authRoutes.js';
import productRoutes from './api/routes/productRoutes.js';
import orderRoutes from './api/routes/orderRoutes.js';
import userRoutes from './api/routes/userRoutes.js';
import passwordRoutes from './api/routes/passwordRoutes.js';
import { authenticateToken, errorHandler, notFound } from './api/middlewares/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de saúde (para Vercel health checks)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API está funcionando' });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/produtos', productRoutes);
app.use('/api/pedidos', orderRoutes);
app.use('/api/usuario', userRoutes);
app.use('/api/password', passwordRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    mensagem: 'Bem-vindo à API FRcomerce',
    versao: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      produtos: '/api/produtos',
      pedidos: '/api/pedidos',
      usuario: '/api/usuario'
    }
  });
});

// Tratamento de erros
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor (apenas em ambiente local)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

export default app;
