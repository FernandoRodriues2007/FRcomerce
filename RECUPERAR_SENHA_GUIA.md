# 🔐 Guia de Recuperação de Senha - FRcomerce

## 📋 Visão Geral

O sistema de recuperação de senha implementado segue os melhores padrões de segurança:

1. **Usuário solicita recuperação** - Entra seu email em `recuperarSenha.html`
2. **API envia email** - Servidor envia email com link seguro (token com expiração)
3. **Usuário clica no link** - Abre `resetarSenha.html?token=xxx`
4. **Token é validado** - Verifica se token é válido e não expirou
5. **Usuário cria nova senha** - Insere e confirma a nova senha
6. **Senha é resetada** - Armazenada com hash seguro no banco

---

## ✅ Arquivos Criados/Modificados

### **Backend (API)**
- ✅ `api/controllers/passwordController.js` - Lógica de recuperação
- ✅ `api/routes/passwordRoutes.js` - Rotas da API
- ✅ `server.js` - Integração das rotas
- ✅ `api/config/schema.sql` - Colunas `reset_token` e `reset_token_expire`
- ✅ `api/package.json` - Dependência `nodemailer`
- ✅ `.env.example` - Variáveis de email

### **Frontend**
- ✅ `recuperarSenha.html` - Formulário de solicitação
- ✅ `recuperarSenha.js` - Lógica do frontend
- ✅ `resetarSenha.html` - Formulário de resetar
- ✅ `resetarSenha.js` - Validação e reset

---

## 🚀 Como Configurar

### **1. Instalar Dependências**
```bash
cd api
npm install
```

### **2. Configurar Email (Gmail)**

#### Para Gmail com 2FA ativo:
1. Acesse https://myaccount.google.com/apppasswords
2. Selecione "Mail" e "Windows Computer"
3. Copie a senha gerada (16 caracteres)

#### Editar `.env`:
```bash
cp .env.example .env
```

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app-aqui
FRONTEND_URL=http://localhost:3000
```

### **3. Atualizar Schema do Banco**

Se o banco já existe, execute:
```sql
ALTER TABLE usuarios ADD COLUMN reset_token VARCHAR(255);
ALTER TABLE usuarios ADD COLUMN reset_token_expire TIMESTAMP;
```

Ou recrie o banco:
```bash
dropdb frcomerce
createdb frcomerce
psql -U postgres -d frcomerce -f api/config/schema.sql
```

### **4. Testar a API**

```bash
# Terminal 1: Iniciar API
cd api
npm run dev

# Terminal 2: Testar (usando curl ou Postman)
curl -X POST http://localhost:3000/api/password/recuperar-senha \
  -H "Content-Type: application/json" \
  -d '{"email":"seu-email@gmail.com"}'
```

---

## 📡 Endpoints da API

### **Solicitar Recuperação**
```
POST /api/password/recuperar-senha
Content-Type: application/json

{
  "email": "usuario@example.com"
}

Response (200):
{
  "mensagem": "Se o email está registrado, você receberá um link para resetar a senha"
}
```

### **Verificar Token**
```
GET /api/password/verificar-token?token=xxx

Response (200):
{
  "valido": true
}

Response (400):
{
  "valido": false,
  "erro": "Token inválido ou expirado"
}
```

### **Resetar Senha**
```
POST /api/password/resetar-senha
Content-Type: application/json

{
  "token": "xxx",
  "novaSenha": "nova123",
  "confirmaSenha": "nova123"
}

Response (200):
{
  "mensagem": "Senha resetada com sucesso!"
}
```

---

## 🔗 Fluxo de UX

### **1. Usuário Esqueceu a Senha**
```
login.html
  ↓ "Esqueceu a senha?"
  ↓
recuperarSenha.html
  [Insere email]
  ↓
API envia email com link
  ↓
"Verifique seu email!"
  ↓ (Clica no link no email)
  ↓
resetarSenha.html?token=xxx
  [Nova senha + Confirmar]
  ↓
"Senha resetada com sucesso!"
  ↓
login.html
```

---

## 🔒 Segurança Implementada

✅ **Hash com Crypto** - Token é hasheado antes de salvar no banco  
✅ **Expiração** - Token expira em 30 minutos  
✅ **Validação** - Email validado antes de enviar  
✅ **Proteção de Informações** - API não revela se email existe (previne ataques)  
✅ **HTTPS em Produção** - Sempre use HTTPS  
✅ **Senha com Hash** - Bcryptjs com 10 salts  

---

## 🧪 Teste Completo

### **Passo 1: Criar Conta**
```bash
# Acesse criarconta.html
# Preencha: Nome, Email, Senha
# Clique em "Criar Conta"
```

### **Passo 2: Solicitar Recuperação**
```bash
# Acesse login.html
# Clique em "Esqueceu a senha?"
# Insira o email usado na criação
# Clique em "Enviar Link de Recuperação"
```

### **Passo 3: Verificar Email**
```bash
# Verifique a caixa de entrada do Gmail
# Procure por email de "FRcomerce"
# Copie o link de recuperação
```

### **Passo 4: Resetar Senha**
```bash
# Cole o link na barra de endereços
# Exemplo: resetarSenha.html?token=abc123...
# Insira nova senha (mínimo 6 caracteres)
# Confirme a nova senha
# Clique em "Resetar Senha"
```

### **Passo 5: Fazer Login**
```bash
# Acesse login.html
# Insira email
# Insira NOVA senha
# Clique em "Login"
```

---

## 🐛 Troubleshooting

### "Email não configurado"
**Solução:** Verifique `.env`:
- `SMTP_USER` está correto?
- `SMTP_PASS` está correto? (use senha de app do Gmail)
- `FRONTEND_URL` está correto?

### "Erro ao enviar email"
**Solução:** 
- Gmail: Ativar "Aplicativos menos seguros"
- Ou usar senha de aplicativo (recomendado)
- Verificar logs: `console.error` no servidor

### "Token inválido"
**Solução:**
- Token expirou (> 30 minutos)
- Banco não foi atualizado com schema novo
- URL foi alterada (parâmetro `token` faltando)

### "Senha não foi alterada"
**Solução:**
- Verificar se ambas as senhas são iguais
- Senha deve ter mínimo 6 caracteres
- Checar logs do servidor

---

## 📧 Personalizar Email

Edit `api/controllers/passwordController.js`, função `requestPasswordReset`:

```javascript
const mailOptions = {
  from: process.env.SMTP_USER,
  to: email,
  subject: 'Seu próprio título',
  html: `
    <h2>Olá ${usuario.nome}!</h2>
    <p>Seu conteúdo aqui</p>
    <a href="${resetUrl}">Seu botão aqui</a>
  `,
};
```

---

## 🚢 Deploy no Vercel

### **Variáveis de Ambiente (Vercel Settings)**
```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = seu-email@gmail.com
SMTP_PASS = sua-senha-app
FRONTEND_URL = https://seu-frontend.vercel.app
```

### **Atualizar URLs no Frontend**
```javascript
// Em recuperarSenha.js e resetarSenha.js
const API_URL = 'https://seu-backend.vercel.app/api';
```

---

## 📞 Suporte

- **Gmail não funciona?** → Use app password
- **Email não chega?** → Verificar pasta de spam
- **Erro 500?** → Consultar logs do servidor
- **Token expirado?** → Solicitar novo link

**Tudo funcionando? Parabéns! 🎉**
