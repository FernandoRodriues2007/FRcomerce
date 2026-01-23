import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Usar DATABASE_URL do Neon/host (OBRIGATÓRIO)
let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Fallback APENAS para desenvolvimento local
  console.warn('⚠️  DATABASE_URL não definida! Usando variáveis de ambiente individuais.');
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || '';
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 5432;
  const database = process.env.DB_NAME;
  
  if (!database) {
    throw new Error('❌ ERRO CRÍTICO: DB_NAME não definido! Use DATABASE_URL ou configure DB_NAME no .env');
  }
  
  if (password) {
    connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;
  } else {
    connectionString = `postgresql://${user}@${host}:${port}/${database}`;
  }
}

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
  } : false,
});

// Testar conexão ao carregar o módulo
pool.on('connect', () => {
  console.log('✅ Conectado ao banco de dados com sucesso');
});

pool.on('error', (err) => {
  console.error('❌ Erro de conexão com banco de dados:', err.message);
  console.error('Verifique suas variáveis de ambiente (DATABASE_URL ou DB_*)');
});

export default pool;
