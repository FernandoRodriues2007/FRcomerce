import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_secret_super_seguro_aqui_mude_em_producao';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ erro: 'Token inválido ou expirado' });
    }

    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  });
}

export function errorHandler(err, req, res, next) {
  console.error(err.stack);

  res.status(err.status || 500).json({
    erro: err.message || 'Erro interno do servidor',
  });
}

export function notFound(req, res, next) {
  res.status(404).json({
    erro: 'Rota não encontrada',
  });
}
