# 🚀 Setup Automático - FRcomerce API

## ⚡ Começar em 2 Minutos

### **Opção 1: Setup Interativo (Recomendado)**

```bash
cd api
npm install
npm run setup
```

Isso vai:
1. ✅ Gerar `JWT_SECRET` automaticamente
2. ✅ Gerar `SMTP_PASS` (senha de app) automaticamente
3. ✅ Perguntar pelas credenciais do banco de dados
4. ✅ Criar arquivo `.env` completo
5. ✅ Tudo pronto para rodar!

---

## 🔑 Gerar Senhas de App

### **Generar 5 Senhas Aleatórias**
```bash
npm run generate:password
```

**Output:**
```
🔐 Gerador de Senha de App (Google/Email)

Senhas Geradas:

  1. a7B#kL9$mN@4pQ2&vW5!xZ
  2. c3D%eF1!hJ@7kL4$mN9&pQ
  3. r5S#tU2@vW8$xY1!zA3%bC
  4. d6E!fG4@hI2$jK9%lM5&nO
  5. p2Q#rS7@tU1$vW4!xY8%zA

💡 Copie uma das senhas acima para usar em .env
```

### **Gerar 10 Senhas**
```bash
npm run generate:passwords
```

---

## 📋 Arquivos de Automação

### **`generate-env.js`**
Script interativo que:
- Pergunta configurações do banco
- Gera JWT_SECRET automaticamente
- Oferece opção Gmail ou Mailhog (testes)
- Cria arquivo `.env` completo

**Uso:**
```bash
npm run setup
```

### **`generate-app-password.js`**
Gera senhas aleatórias de 16 caracteres (compatível com Google App Password)

**Uso:**
```bash
npm run generate:password      # 5 senhas
npm run generate:passwords     # 10 senhas
node generate-app-password.js 3 20  # 3 senhas de 20 caracteres
```

---

## 🔄 Fluxo de Setup Completo

### **Passo 1: Clonar e Instalar**
```bash
cd FRcomerce/api
npm install
```

### **Passo 2: Gerar Configurações**
```bash
npm run setup
```

Você vai ver:
```
🔧 Gerador de Configuração - FRcomerce API

📝 Configure as variáveis de ambiente:

Database
  DB_HOST (localhost): [ENTER]
  DB_PORT (5432): [ENTER]
  DB_USER (postgres): [ENTER]
  DB_PASSWORD: sua_senha
  DB_NAME (frcomerce): [ENTER]

Segurança
  ✓ JWT_SECRET gerado automaticamente

Email (Recuperação de Senha)
  Usar Gmail? (s/n): s
  SMTP_USER (seu-email@gmail.com): seu-email@gmail.com
  SMTP_PASS (senha de app): [deixar em branco ou colar]

Frontend
  FRONTEND_URL (http://localhost:3000): [ENTER]

Ambiente
  NODE_ENV (development): [ENTER]
  PORT (3000): [ENTER]

✅ Arquivo .env criado com sucesso!
```

### **Passo 3: Se Não Tiver Senha de App**

Se deixar em branco, o script gera uma automaticamente:

```bash
⚠️  Nenhuma senha fornecida. Gerando uma para teste:
Senha gerada: aBc#DeF1$GhI2@JkL
```

### **Passo 4: Criar Banco de Dados**
```bash
createdb frcomerce
psql -U postgres -d frcomerce -f api/config/schema.sql
```

### **Passo 5: Iniciar API**
```bash
npm run dev
```

**Pronto! API rodando em http://localhost:3000** 🎉

---

## 🧪 Opção de Teste (Sem Gmail Real)

Se escolher "n" para Gmail, o script configura **Mailhog** (serviço de email fake):

```bash
🔧 Email (Recuperação de Senha)
  Usar Gmail? (s/n): n
  ✓ Usando Mailhog para testes
```

### **Instalar Mailhog com Docker:**
```bash
docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

### **Visualizar Emails Enviados:**
Abra http://localhost:8025 no navegador

### **Vantagens:**
- ✅ Não precisa de senha real
- ✅ Testa recuperação de senha localmente
- ✅ Vê todos os emails enviados na UI
- ✅ Perfeito para desenvolvimento

---

## 📊 Variáveis Geradas Automaticamente

```env
# JWT Secret (sempre único e seguro)
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0

# SMTP_PASS (16 caracteres seguros)
SMTP_PASS=aBc#DeF1$GhI2@JkL

# Tudo mais você fornece
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=frcomerce
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=3000
```

---

## 🔐 Segurança

Os scripts geram senhas usando:
- ✅ `crypto.randomInt()` - Criptografia nativa do Node
- ✅ Caracteres especiais - `!@#$%^&*()` 
- ✅ Mix de maiúsculas e minúsculas
- ✅ Números aleatórios

**Resultado:** Senhas altamente seguras para produção!

---

## 🎯 Casos de Uso

### **Primeira Vez Desenvolvendo**
```bash
npm install
npm run setup  # Escolha "n" para Mailhog
docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog  # Terminal 2
npm run dev    # Terminal 3
```

### **Migrando para Gmail Real**
```bash
npm run generate:password  # Gerar nova senha
# Atualizar SMTP_PASS no .env
npm run dev
```

### **Deploy na Vercel**
```bash
npm run generate:password  # Pegar uma senha
# Configurar na Vercel como variável de ambiente
```

---

## 🐛 Troubleshooting

### "Comando npm run setup não funciona"
- Verifique se está na pasta `api/`
- Certifique-se de ter rodado `npm install`

### "Não consegue conectar ao banco"
- Verifique as credenciais no `.env`
- PostgreSQL está rodando?
- Banco `frcomerce` foi criado?

### "Email não envia"
- Verifique `SMTP_USER` e `SMTP_PASS`
- Se Gmail: ativar "Aplicativos menos seguros" ou usar App Password
- Se Mailhog: Docker está rodando em localhost:1025?

---

## 📚 Documentação Relacionada

- [API_README.md](../API_README.md) - Documentação completa da API
- [RECUPERAR_SENHA_GUIA.md](../RECUPERAR_SENHA_GUIA.md) - Setup de recuperação de senha
- [INTEGRACAO_GUIA.md](../INTEGRACAO_GUIA.md) - Integração frontend/backend

---

**Seu setup está automatizado! Você só precisa informar dados sensíveis.** ✨
