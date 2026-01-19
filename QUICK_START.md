# ⚡ Quick Reference - FRcomerce

## 🚀 Iniciar em 3 Passos

```bash
# 1. Na raiz do projeto
node init.js

# 2. Criar banco de dados
createdb frcomerce
psql -U postgres -d frcomerce -f api/config/schema.sql

# 3. Iniciar API
cd api && npm run dev
```

**Pronto! API rodando em http://localhost:3000**

---

## 🔐 Gerar Senhas

```bash
# 5 senhas aleatórias
cd api && npm run generate:password

# 10 senhas aleatórias
cd api && npm run generate:passwords

# Customizado (3 senhas de 20 caracteres)
cd api && node generate-app-password.js 3 20
```

---

## 📧 Configurar Email

### **Opção A: Gmail Real**
1. https://myaccount.google.com/apppasswords
2. Gere app password (16 caracteres)
3. Cole em `api/.env` → `SMTP_PASS=xxx`

### **Opção B: Mailhog (Testes)**
```bash
docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog
```
Visualize em http://localhost:8025

---

## 📡 Endpoints Principais

| Método | URL | Descrição |
|--------|-----|-----------|
| POST | `/api/auth/registrar` | Criar conta |
| POST | `/api/auth/login` | Fazer login |
| GET | `/api/produtos` | Listar produtos |
| GET | `/api/produtos/:id` | Detalhes produto |
| POST | `/api/password/recuperar-senha` | Solicitar reset |
| GET | `/api/usuario/me` | Meu perfil |

---

## 📁 Estrutura

```
FRcomerce/
├── api/              ← Backend (Express)
├── E-comerc/         ← Frontend (HTML/Tailwind)
├── init.js           ← Setup automático
├── README.md         ← Este arquivo
└── SETUP_AUTOMATIZADO.md ← Documentação completa
```

---

## 🛠️ Scripts Úteis

```bash
# Setup interativo
cd api && npm run setup

# Gerar senhas
cd api && npm run generate:password

# Desenvolvimento
cd api && npm run dev

# Produção
cd api && npm start
```

---

## 🔑 Variáveis .env (Auto-Geradas)

```env
# Banco de Dados (URL de conexão completa)
DATABASE_URL=postgresql://postgres:sua_senha@localhost:5432/frcomerce

# Segurança
JWT_SECRET=xxx (gerado automaticamente)

# Email (Recuperação de Senha)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=xxx (gerado automaticamente)

# Frontend
FRONTEND_URL=http://localhost:3000

# Ambiente
NODE_ENV=development
PORT=3000
```

---

## ✅ Checklist de Setup

- [ ] `node init.js` executado
- [ ] `api/.env` editado (DATABASE_URL, SMTP_USER)
- [ ] `createdb frcomerce` executado
- [ ] Schema SQL importado
- [ ] `npm run dev` rodando na pasta `api/`
- [ ] API respondendo em http://localhost:3000/api/health

---

## 🐛 Problemas Comuns

| Erro | Solução |
|------|---------|
| `ECONNREFUSED 127.0.0.1:5432` | PostgreSQL não está rodando |
| `database "frcomerce" does not exist` | Execute `createdb frcomerce` |
| `Porta 3000 em uso` | Mude PORT no .env |
| `Email não funciona` | Configure SMTP_PASS corretamente |

---

## 📚 Documentação Completa

- [SETUP_AUTOMATIZADO.md](SETUP_AUTOMATIZADO.md)
- [API_README.md](API_README.md)
- [RECUPERAR_SENHA_GUIA.md](RECUPERAR_SENHA_GUIA.md)
- [INTEGRACAO_GUIA.md](INTEGRACAO_GUIA.md)

---

**Tudo automatizado para você! 🎉**
