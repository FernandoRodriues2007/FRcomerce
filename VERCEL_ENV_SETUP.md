# 🔧 Configurar Variáveis de Ambiente no Vercel

## ❌ PROBLEMA RESOLVIDO

O erro `Environment Variable "DATABASE_URL" references Secret "database_url", which does not exist` ocorre porque o `vercel.json` estava tentando referenciar secrets que não existem.

**Solução**: As variáveis de ambiente devem ser configuradas diretamente no **Vercel Dashboard**, não através de referências em `vercel.json`.

---

## ✅ SOLUÇÃO: CONFIGURAR NO VERCEL DASHBOARD

### Passo 1: Acessar o Projeto no Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto **FRcomerce**
3. Clique em **Settings** (engrenagem)

### Passo 2: Ir para Environment Variables

1. No menu lateral, selecione **Environment Variables**
2. Você verá a seção "**Environment Variables**"

### Passo 3: Adicionar as Variáveis

Clique em **"Add New"** e adicione EXATAMENTE essas variáveis:

#### 🗄️ **DATABASE_URL** (Crítica)
```
Variable Name: DATABASE_URL
Value: postgresql://usuario:senha@host:porta/banco
Environment: Production, Preview, Development
```

**Exemplo (Supabase):**
```
postgresql://postgres.xxxxx:senha@db.xxxxx.supabase.co:5432/postgres
```

**Exemplo (Railway):**
```
postgresql://root:senha@containers.railway.app:7899/railway
```

#### 🔐 **JWT_SECRET** (Crítica)
```
Variable Name: JWT_SECRET
Value: [Gere com: openssl rand -hex 32]
Environment: Production, Preview, Development
```

**Exemplo de valor gerado:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

#### 🌐 **FRONTEND_URL**
```
Variable Name: FRONTEND_URL
Value: https://seu-dominio-frontend.vercel.app
Environment: Production
```

#### 📧 **SMTP_HOST**
```
Variable Name: SMTP_HOST
Value: smtp.gmail.com
Environment: Production, Preview, Development
```

#### 📧 **SMTP_PORT**
```
Variable Name: SMTP_PORT
Value: 587
Environment: Production, Preview, Development
```

#### 📧 **SMTP_USER**
```
Variable Name: SMTP_USER
Value: seu-email@gmail.com
Environment: Production, Preview, Development
```

#### 📧 **SMTP_PASS**
```
Variable Name: SMTP_PASS
Value: sua-senha-app-google
Environment: Production, Preview, Development
```

#### 🏗️ **NODE_ENV**
```
Variable Name: NODE_ENV
Value: production
Environment: Production
```

---

## 📋 CHECKLIST

Após adicionar todas as variáveis:

- [ ] DATABASE_URL configurada e testada
- [ ] JWT_SECRET é único e seguro
- [ ] FRONTEND_URL aponta para seu domínio
- [ ] SMTP_HOST = smtp.gmail.com
- [ ] SMTP_USER = seu email Gmail
- [ ] SMTP_PASS = senha de app (não senha da conta!)
- [ ] NODE_ENV = production
- [ ] Todas as variáveis estão marcadas para "Production"

---

## 🚀 FAZER NOVO DEPLOY

Após configurar as variáveis:

### Opção 1: Redeploy Automático
1. Faça um novo commit e push
   ```bash
   git commit --allow-empty -m "trigger: redeploy with correct env vars"
   git push origin main
   ```
2. Vercel fará deploy automático com as novas variáveis

### Opção 2: Redeploy Manual
1. No Vercel Dashboard, vá para **Deployments**
2. Clique nos **3 pontos** do último deploy
3. Selecione **Redeploy**

---

## ✅ VERIFICAR SE FUNCIONOU

```bash
# Acessar sua API
curl https://seu-projeto.vercel.app/api/health

# Deve retornar:
# {"status":"OK","message":"API está funcionando"}
```

Se retornar erro de conexão com banco, verificar:
- DATABASE_URL está correta
- Firewall do banco permite IP do Vercel
- Banco está online

---

## 🔍 TROUBLESHOOTING

### Erro: "Cannot connect to database"
**Solução:**
1. Verificar `DATABASE_URL` está correta
2. Testar localmente com a mesma URL:
   ```bash
   psql "seu-database-url"
   ```
3. Se tiver Supabase, verificar:
   - Projeto está ativo
   - IP do Vercel está na whitelist (geralmente automático)

### Erro: "JWT token invalid"
**Solução:**
1. Verificar `JWT_SECRET` foi configurado
2. Usar o mesmo JWT_SECRET em todos os ambientes
3. Se mudar JWT_SECRET, usuários precisarão fazer login novamente

### Erro: "Email not sending"
**Solução:**
1. Verificar `SMTP_USER` e `SMTP_PASS`
2. Confirmar que é **Senha de App Google**, não senha da conta
3. Para gerar: https://myaccount.google.com/apppasswords

---

## 📚 DOCUMENTAÇÃO

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Connection String](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Railway PostgreSQL](https://docs.railway.app/databases/postgresql)

---

## ✨ PRÓXIMOS PASSOS

1. ✅ Configurar variáveis no Vercel
2. ✅ Fazer novo deploy
3. ✅ Testar `/api/health`
4. ✅ Testar endpoints da API
5. ✅ Testar login/registro
6. ✅ Testar recuperação de senha

**Pronto! Seu projeto deve estar funcionando agora! 🎉**
