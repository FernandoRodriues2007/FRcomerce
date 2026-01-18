# 🚀 FRcomerce - Backend API

API Express para plataforma de e-commerce FRcomerce com autenticação JWT e PostgreSQL.

## 📋 Requisitos

- Node.js 16+
- PostgreSQL 12+
- npm ou yarn

## 📦 Instalação

### 1. Clonar repositório e entrar na pasta
```bash
cd FRcomerce
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar banco de dados
- Criar um banco PostgreSQL chamado `frcomerce`
- Executar o SQL em `api/config/schema.sql`

```bash
psql -U postgres -d frcomerce -f api/config/schema.sql
```

### 4. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Editar .env com suas credenciais
```

## 🏃 Executando

### Desenvolvimento (com auto-reload)
```bash
npm run dev
```

### Produção
```bash
npm start
```

API rodará em `http://localhost:3000`

## 📚 Endpoints Disponíveis

### Autenticação
- `POST /api/auth/registrar` - Criar nova conta
- `POST /api/auth/login` - Fazer login

### Usuário (requer autenticação)
- `GET /api/usuario/me` - Dados do perfil
- `PUT /api/usuario/perfil` - Atualizar perfil

### Produtos
- `GET /api/produtos` - Listar produtos
- `GET /api/produtos?categoria=eletrônicos` - Filtrar por categoria
- `GET /api/produtos/:id` - Detalhes do produto
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Deletar produto

### Pedidos (requer autenticação)
- `POST /api/pedidos` - Criar pedido
- `GET /api/pedidos` - Listar meus pedidos
- `GET /api/pedidos/:id` - Detalhes do pedido
- `PUT /api/pedidos/:id` - Atualizar status

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens). Após fazer login/registrar, você receberá um token.

Para usar endpoints protegidos, envie o token no header:
```
Authorization: Bearer seu_token_aqui
```

## 🌐 CORS

Frontend pode acessar a API. Configurar `FRONTEND_URL` no `.env`

## 📊 Estrutura do Projeto

```
api/
├── config/
│   ├── database.js      # Conexão PostgreSQL
│   └── schema.sql       # Esquema do banco
├── controllers/
│   ├── authController.js      # Lógica de autenticação
│   ├── productController.js   # Lógica de produtos
│   └── orderController.js     # Lógica de pedidos
├── models/
│   └── models.js        # Classes de modelos
├── routes/
│   ├── authRoutes.js    # Rotas de auth
│   ├── productRoutes.js # Rotas de produtos
│   ├── orderRoutes.js   # Rotas de pedidos
│   └── userRoutes.js    # Rotas de usuário
├── middlewares/
│   └── auth.js          # Middlewares
├── utils/               # Utilitários
└── index.js             # Entry point para Vercel

server.js                # Servidor principal
vercel.json             # Configuração Vercel
.env.example            # Template de variáveis
```

## 🚢 Deploy no Vercel

1. Push para GitHub
2. Conectar repositório no Vercel
3. Definir variáveis de ambiente
4. Deploy automático

## 🛠️ Variáveis de Ambiente

Configurar no `.env`:

```env
DB_HOST=seu_host
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=frcomerce
JWT_SECRET=seu_secret_seguro
FRONTEND_URL=sua_url_frontend
NODE_ENV=production
```

## 📝 Exemplo de Requisição

### Registrar
```bash
curl -X POST http://localhost:3000/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@example.com","senha":"123456"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","senha":"123456"}'
```

### Listar Produtos
```bash
curl http://localhost:3000/api/produtos
```

## 🐛 Troubleshooting

### Erro de conexão com BD
- Verificar se PostgreSQL está rodando
- Validar credenciais no `.env`
- Confirmar que banco `frcomerce` existe

### Erro de CORS
- Verificar `FRONTEND_URL` no `.env`
- Certificar que headers estão corretos

## 📄 Licença

MIT
