# 🚀 GUIA COMPLETO - COMO RODAR O PROJETO FRCOMERCE

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:
- **Node.js** (versão 14+) - [Baixar](https://nodejs.org/)
- **PostgreSQL** (versão 12+) - [Baixar](https://www.postgresql.org/download/)
- **Git** (opcional) - [Baixar](https://git-scm.com/)

Verifique a instalação:
```bash
node --version    # v16.x ou superior
npm --version     # 7.x ou superior
psql --version    # PostgreSQL 12+
```

---

## ✅ SETUP INICIAL (Primeira Vez)

### **Passo 1: Clonar ou acessar o projeto**
```bash
cd c:\Users\ferna\OneDrive\Documentos\Programação\Programação\ HTML\html\Tailwindcss\FRcomerce
```

### **Passo 2: Instalar dependências**
```bash
# Na raiz do projeto
npm install

# Na pasta da API
cd api
npm install
cd ..
```

### **Passo 3: Criar o banco de dados PostgreSQL**

**Opção A: Usando pgAdmin (Interface Gráfica)**
1. Abra pgAdmin (instalado com PostgreSQL)
2. Clique em "Servers" → PostgreSQL
3. Clique direito em "Databases" → "Create" → "Database"
4. Nome: `frcomerce` → Clique em "Save"

**Opção B: Usando Command Line**
```bash
# Abra PowerShell como Administrador
createdb -U postgres frcomerce

# Se pedir senha, digite a senha do PostgreSQL que você definiu na instalação
```

### **Passo 4: Criar tabelas do banco de dados**

**Opção A: Usando psql (Command Line)**
```bash
psql -U postgres -d frcomerce -f api/config/schema.sql
```

**Opção B: Usando pgAdmin**
1. Clique na database `frcomerce`
2. Clique em "Query Tool"
3. Copie todo conteúdo de `api/config/schema.sql`
4. Cole no Query Tool
5. Clique em "Execute"

### **Passo 5: Criar arquivo .env**

Copie o arquivo `.env.example` para `.env`:
```bash
# Na pasta api/
copy .env.example .env
```

Depois edite o arquivo `api/.env` com suas credenciais:
```env
# Para conexão local padrão:
DB_USER=postgres
DB_PASSWORD=sua_senha_postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=frcomerce

JWT_SECRET=sua_chave_secreta_aqui_mude_em_producao
NODE_ENV=development
PORT=3000
```

---

## 🎯 RODAR O PROJETO

### **Opção 1: Desenvolvimento (com Hot Reload)**

```bash
# Na raiz do projeto
cd api
npm run dev
```

A API estará em: **http://localhost:3000**

**Saída esperada:**
```
Servidor rodando em http://localhost:3000
✅ Conectado ao banco de dados com sucesso
```

### **Opção 2: Produção**

```bash
# Na raiz do projeto
cd api
npm start
```

### **Opção 3: Sem reinicialização (Modo simples)**

```bash
# Na raiz do projeto
node server.js
```

---

## 🧪 TESTAR A API

Após iniciar o servidor, teste os endpoints:

### **1. Verificar se a API está online**
```bash
curl http://localhost:3000/api/health
```

### **2. Acessar o frontend**
Abra no navegador: **http://localhost:3000**

### **3. Testar a rota raiz**
```bash
curl http://localhost:3000/
```

---

## 📧 CONFIGURAR EMAIL (Opcional)

### **Gmail com App Password (Recomendado)**

1. Ative 2FA em https://myaccount.google.com/
2. Acesse https://myaccount.google.com/apppasswords
3. Selecione "Mail" e "Windows"
4. Copie a senha gerada (16 caracteres)
5. Edit `api/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=xxxxxxxxxxxxxxxxxx
SMTP_FROM=seu_email@gmail.com
```

### **Mailhog para Testes (Sem Gmail Real)**

```bash
# Instale Docker
# Depois execute:
docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog

# Configure em api/.env:
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=test
SMTP_PASS=test

# Visualize emails em: http://localhost:8025
```

---

## 🐛 SOLUCIONAR PROBLEMAS

### **Erro: "ECONNREFUSED" ao conectar ao banco**
```
❌ Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Soluções:**
1. Verifique se PostgreSQL está rodando:
   ```bash
   # Windows: Abra Services (services.msc) e procure por "postgresql"
   # Certifique-se de que está "Running"
   ```
2. Verifique credenciais em `api/.env`:
   ```bash
   # Teste manualmente:
   psql -U postgres -h localhost
   ```
3. Verifique se banco existe:
   ```bash
   psql -U postgres -l | findstr frcomerce
   ```

### **Erro: "ENOENT" arquivo não encontrado**
```
❌ Error: ENOENT: no such file or directory
```

**Solução:**
```bash
# Certifique-se de estar na pasta correta:
pwd  # ou cd no PowerShell

# Instale dependências novamente:
npm install
cd api && npm install
```

### **Erro: "Module not found: express"**
```bash
# Na pasta api, rode:
npm install
```

### **Porta 3000 já está em uso**
```bash
# Use outra porta:
PORT=4000 npm start
```

### **Sem conexão com banco mas tudo parece OK**
```bash
# Teste a conexão manualmente:
psql -U postgres -d frcomerce -c "SELECT 1"

# Se falhar, recrie o banco:
dropdb -U postgres frcomerce
createdb -U postgres frcomerce
psql -U postgres -d frcomerce -f api/config/schema.sql
```

---

## 📁 ESTRUTURA DO PROJETO

```
FRcomerce/
├── api/                    # Backend (Node.js + Express + PostgreSQL)
│   ├── config/
│   │   ├── database.js     # Configuração de conexão
│   │   └── schema.sql      # Criação de tabelas
│   ├── controllers/        # Lógica de negócio
│   ├── models/             # Modelos de dados
│   ├── routes/             # Rotas da API
│   ├── middlewares/        # Autenticação e tratamento de erros
│   ├── package.json        # Dependências
│   └── .env                # Variáveis de ambiente
├── E-comerc/              # Frontend (HTML/CSS/JavaScript)
│   ├── index.html         # Página principal
│   ├── login.html
│   ├── criarconta.html
│   ├── recuperarSenha.html
│   └── assets/
│       ├── js/            # JavaScript do frontend
│       └── img/           # Imagens
├── server.js              # Servidor principal
└── README.md              # Documentação
```

---

## 📚 COMANDOS ÚTEIS

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Rodar em produção
npm start

# Gerar senhas aleatórias
cd api && npm run generate:password

# Gerar múltiplas senhas
cd api && npm run generate:passwords

# Resetar banco de dados completamente
psql -U postgres -c "DROP DATABASE frcomerce;"
psql -U postgres -c "CREATE DATABASE frcomerce;"
psql -U postgres -d frcomerce -f api/config/schema.sql
```

---

## ✨ PRONTO!

Se tudo deu certo, você verá:

```
✅ Conectado ao banco de dados com sucesso
Servidor rodando em http://localhost:3000
```

E poderá acessar:
- **Frontend:** http://localhost:3000
- **API:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/api/health

---

## 🆘 AINDA TEM PROBLEMAS?

1. Verifique se Node.js e PostgreSQL estão instalados corretamente
2. Verifique se a porta 3000 está disponível
3. Verifique se PostgreSQL está rodando
4. Cheque os logs de erro no terminal
5. Delete `node_modules` e `package-lock.json`, depois rode `npm install` novamente

**Sucesso! 🚀**
