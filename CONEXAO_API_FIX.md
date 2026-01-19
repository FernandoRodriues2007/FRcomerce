# 🔧 CORRIGIR ERRO DE CONEXÃO - Criar Conta

## 🔴 PROBLEMA IDENTIFICADO

O frontend (HTML files em `E-comerc/`) está tentando conectar na API com a URL errada ou a API não está acessível.

**Erro típico:** "Erro ao conectar com o servidor. Verifique se a API está rodando."

---

## ✅ SOLUÇÃO

Existem 2 formas de rodar o projeto:

### OPÇÃO 1: Servidor Separado (Recomendado para Desenvolvimento)

#### **Terminal 1: Rodar a API**
```bash
cd api
npm run dev
# A API estará em: http://localhost:3000/api
```

#### **Terminal 2: Servir o Frontend**
```bash
# Instalar servidor HTTP simples (se não tiver)
npm install -g http-server

# Na raiz do projeto
http-server -p 8080
# O frontend estará em: http://localhost:8080
```

#### **Arquivo a Editar: `E-comerc/assets/js/criarconta.js`**
```javascript
// MUDE ISSO:
const API_URL = 'http://localhost:3000/api'; // ← ERRADO (tenta na porta 3000)

// PARA ISTO:
const API_URL = 'http://localhost:3000/api'; // ← CORRETO (API está em 3000)
```

⚠️ **IMPORTANTE:** Se o frontend está em porta diferente (ex: 8080), o CORS precisa estar configurado!

---

### OPÇÃO 2: Tudo na Mesma Porta (Mais Simples)

Servir os arquivos HTML através da API Node:

#### **Modificar `server.js`:**

```javascript
// Adicionar no topo do arquivo:
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Após os middlewares de CORS e JSON:
// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'E-comerc')));

// Rota fallback para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'E-comerc', 'index.html'));
});
```

#### **Executar:**
```bash
npm run dev
# Tudo em: http://localhost:3000
```

#### **Arquivo a Editar: `E-comerc/assets/js/criarconta.js`**
```javascript
// Use URL relativa:
const API_URL = '/api'; // ← Acessa http://localhost:3000/api
```

---

## 🔍 TESTAR A CONEXÃO

### Teste 1: API está rodando?
```bash
curl http://localhost:3000/api/health
# Deve retornar: {"status":"OK","message":"API está funcionando"}
```

### Teste 2: Endpoint de registro funciona?
```bash
curl -X POST http://localhost:3000/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome":"Teste",
    "email":"teste@example.com",
    "senha":"123456"
  }'
```

### Teste 3: Frontend consegue acessar?
No console do navegador (F12):
```javascript
fetch('http://localhost:3000/api/auth/registrar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'Teste',
    email: 'teste@example.com',
    senha: '123456'
  })
})
.then(r => r.json())
.then(d => console.log(d))
.catch(e => console.error(e))
```

---

## 🛠️ CHECKLIST DE CONFIGURAÇÃO

### API
- [ ] API rodando em `npm run dev`
- [ ] Responde em `http://localhost:3000`
- [ ] Endpoint `/api/health` retorna OK
- [ ] Banco de dados conectado
- [ ] `DATABASE_URL` configurada no `.env`

### Frontend
- [ ] HTML files em `E-comerc/`
- [ ] Arquivo `criarconta.js` atualizado com URL correta
- [ ] Console do navegador sem erros de CORS
- [ ] API_URL aponta para `http://localhost:3000/api`

### CORS
- [ ] `server.js` tem `cors()` configurado
- [ ] `FRONTEND_URL` no `.env` está correto
- [ ] Se frontend em porta diferente, verificar CORS

---

## 🐛 TROUBLESHOOTING

### Erro: "Failed to fetch"
```
Solução:
1. Verificar se API está rodando (npm run dev)
2. Verificar URL em criarconta.js
3. Verificar console do navegador (F12)
```

### Erro: "CORS error"
```
Solução:
1. Verificar FRONTEND_URL no .env
2. Deixar vazio para aceitar qualquer origem (dev):
   const cors = require('cors');
   app.use(cors()); // Sem configuração = aceita tudo
3. Em produção, configurar com origem específica
```

### Erro: "Database connection refused"
```
Solução:
1. PostgreSQL está rodando?
2. DATABASE_URL está correta?
3. Banco de dados "frcomerce" foi criado?
   createdb frcomerce
4. Schema foi importado?
   psql -U postgres -d frcomerce -f api/config/schema.sql
```

### Erro: "Email validation failed"
```
Solução:
1. Verificar se email contém @
2. Verificar comprimento da senha (mín 6 caracteres)
3. Verificar se email já não existe no banco
```

---

## 📝 ARQUIVOS A MODIFICAR

Se escolher **OPÇÃO 1** (Servidor Separado):
- ✅ `E-comerc/assets/js/criarconta.js` - URL já está correta
- ✅ `E-comerc/assets/js/api-client.js` - URL já está correta

Se escolher **OPÇÃO 2** (Tudo na mesma porta):
- 🔧 `server.js` - Adicionar static files
- 🔧 `E-comerc/assets/js/criarconta.js` - Mudar para `/api`
- 🔧 `E-comerc/assets/js/api-client.js` - Mudar para `/api`

---

## ✅ PASSO A PASSO RÁPIDO

### Setup para DESENVOLVIMENTO:

```bash
# Terminal 1: Iniciar API
cd api
npm install  # Se necessário
npm run dev

# Terminal 2 (nova janela): Servir frontend
http-server -p 8080
# Ou em outra porta se 8080 estiver ocupada
```

**Acessar em:** http://localhost:8080

**Verificar:**
1. Ir para página "Criar Conta"
2. Preencher formulário
3. Clicar "Criar Conta"
4. Deve redirecionar para login se funcionou

Se não funcionar, abrir **Console (F12)** e procurar por erros.

---

## 🎯 RESUMO

| Elemento | URL |
|----------|-----|
| **API** | http://localhost:3000 |
| **Frontend HTML** | http://localhost:8080 ou 3000 |
| **Endpoint Registro** | POST http://localhost:3000/api/auth/registrar |
| **Health Check** | GET http://localhost:3000/api/health |

Verifique que ambos estão rodando e que a URL no JavaScript aponta para a API corretamente!
