# 🛍️ FRcomerce - Plataforma de E-commerce

Plataforma de e-commerce completa com backend Express + PostgreSQL e frontend HTML/Tailwind.

## 🚀 Quick Start (2 minutos)

### **1. Inicializar Projeto**
```bash
node init.js
```

Isso vai:
- ✅ Instalar dependências
- ✅ Gerar JWT_SECRET automaticamente
- ✅ Gerar SMTP_PASS (16 caracteres) automaticamente
- ✅ Criar arquivo `.env`

### **2. Configurar Banco de Dados**
```bash
createdb frcomerce
psql -U postgres -d frcomerce -f api/config/schema.sql
```

### **3. Editar `.env`**
```bash
# Abra api/.env e configure:
DB_PASSWORD=sua_senha_postgres
SMTP_USER=seu-email@gmail.com  (ou deixe localhost para Mailhog)
```

### **4. Iniciar API**
```bash
cd api
npm run dev
```

**Pronto!** API rodando em http://localhost:3000

---

## 📁 Estrutura do Projeto

```
FRcomerce/
├── api/                          # Backend Express
│   ├── config/
│   │   ├── database.js          # Conexão PostgreSQL
│   │   └── schema.sql           # Tabelas do banco
│   ├── controllers/             # Lógica de negócio
│   ├── models/                  # Modelos de dados
│   ├── routes/                  # Rotas da API
│   ├── middlewares/             # Autenticação, erros
│   ├── generate-env.js          # Setup interativo
│   ├── generate-app-password.js # Gerar senhas
│   ├── package.json
│   └── server.js                # Servidor principal
│
├── E-comerc/                     # Frontend
│   ├── index.html               # Página inicial
│   ├── login.html               # Login
│   ├── criarconta.html          # Registro
│   ├── recuperarSenha.html      # Recuperar senha
│   ├── resetarSenha.html        # Resetar senha
│   ├── principal.html           # Produtos
│   ├── Pagamento.html           # Checkout
│   └── assets/
│       └── js/                  # Scripts frontend
│
├── SETUP_AUTOMATIZADO.md        # Este guia
├── API_README.md                # Documentação API
├── RECUPERAR_SENHA_GUIA.md      # Recuperação de senha
├── INTEGRACAO_GUIA.md           # Integração frontend
└── init.js                      # Script de inicialização
```

---

## ⚙️ Automação

### **Scripts Backend** (em `api/`)

```bash
npm run dev                 # Desenvolvimento com nodemon
npm run start               # Produção
npm run setup               # Setup interativo (.env)
npm run generate:password   # Gerar 5 senhas de 16 caracteres
npm run generate:passwords  # Gerar 10 senhas
```

### **Script Principal** (na raiz)

```bash
node init.js                # Setup completo do projeto
```

---

## 🔐 Geração Automática de Senhas

Não precisa mais copiar senha de app manualmente! Temos 3 formas:

### **Opção 1: Setup Completo**
```bash
node init.js
```
Gera tudo automaticamente!

### **Opção 2: Só Senhas**
```bash
cd api
npm run generate:password   # 5 senhas
npm run generate:passwords  # 10 senhas
```

### **Opção 3: Setup Interativo**
```bash
cd api
npm run setup
```
Deixa em branco e gera automaticamente!

---

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/registrar` - Criar conta
- `POST /api/auth/login` - Fazer login

### Usuário
- `GET /api/usuario/me` - Meu perfil (autenticado)
- `PUT /api/usuario/perfil` - Atualizar perfil (autenticado)

### Produtos
- `GET /api/produtos` - Listar produtos
- `GET /api/produtos/:id` - Detalhes do produto
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Deletar produto

### Recuperação de Senha
- `POST /api/password/recuperar-senha` - Solicitar reset
- `GET /api/password/verificar-token` - Validar token
- `POST /api/password/resetar-senha` - Resetar senha

### Pedidos
- `GET /api/pedidos` - Meus pedidos (autenticado)
- `POST /api/pedidos` - Criar pedido (autenticado)
- `GET /api/pedidos/:id` - Detalhes do pedido (autenticado)
- `PUT /api/pedidos/:id` - Atualizar status (autenticado)

---

## 📧 Configurar Email

### **Gmail (Recomendado)**
1. Ative 2FA em https://myaccount.google.com
2. Vá para https://myaccount.google.com/apppasswords
3. Selecione "Mail" e "Windows Computer"
4. Copie a senha gerada (16 caracteres)
5. Cole em `api/.env` como `SMTP_PASS=xxx`

**OU deixe o script gerar automaticamente!**

### **Mailhog (Testes Locais)**
```bash
docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog
```
Visualize emails em http://localhost:8025

---

## 🧪 Testando a API

### Com cURL
```bash
# Registrar
curl -X POST http://localhost:3000/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome":"João",
    "email":"joao@example.com",
    "senha":"123456"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"joao@example.com",
    "senha":"123456"
  }'

# Listar produtos
curl http://localhost:3000/api/produtos
```

### Com Postman
Importe a URL: `http://localhost:3000/api`

---

## 🚢 Deploy na Vercel

### 1. Push para GitHub
```bash
git add .
git commit -m "Projeto FRcomerce completo"
git push
```

### 2. Conectar no Vercel
- Vá para https://vercel.com
- Clique "Import Project"
- Selecione seu repositório GitHub

### 3. Variáveis de Ambiente
Adicione no Vercel:
```
DB_HOST=seu-host-postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua-senha
DB_NAME=frcomerce
JWT_SECRET=sua-secret-super-segura
FRONTEND_URL=https://seu-frontend.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
```

### 4. Deploy
Clique "Deploy"!

---

## 📚 Documentação Completa

- **[SETUP_AUTOMATIZADO.md](SETUP_AUTOMATIZADO.md)** - Automação e scripts
- **[API_README.md](API_README.md)** - Documentação da API em detalhes
- **[RECUPERAR_SENHA_GUIA.md](RECUPERAR_SENHA_GUIA.md)** - Setup recuperação de senha
- **[INTEGRACAO_GUIA.md](INTEGRACAO_GUIA.md)** - Integração frontend-backend

---

## 🎯 Features

✅ Autenticação JWT  
✅ Recuperação de senha com email  
✅ CRUD de produtos  
✅ Gerenciamento de pedidos  
✅ Carrinho de compras (localStorage)  
✅ Validação de dados  
✅ CORS habilitado  
✅ Hash seguro de senhas  
✅ Tokens com expiração  

---

## 🐛 Troubleshooting

**Erro ao conectar BD?**
- Verifique se PostgreSQL está rodando
- Verifique credenciais em `.env`
- Execute: `createdb frcomerce`

**Email não funciona?**
- Gmail: Use app password (https://myaccount.google.com/apppasswords)
- Verifique `SMTP_USER` e `SMTP_PASS`
- Para testes: Use Mailhog em localhost:1025

**Porta 3000 já em uso?**
- Mude `PORT=` em `.env`
- Ou: `kill -9 $(lsof -t -i:3000)` (macOS/Linux)

---

## 📞 Suporte

Se encontrar problemas:
1. Consulte os guias de documentação
2. Verifique os logs do servidor: `console.log`
3. Teste endpoints com cURL ou Postman

---

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ por FRcomerce**
