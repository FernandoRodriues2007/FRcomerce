# 🚀 Guia de Deploy no Vercel - FRcomerce

## Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Repositório GitHub com o código
- Banco de dados PostgreSQL (Supabase, Railway, Heroku, etc)

## 1️⃣ Preparar o Repositório

Garanta que todos os arquivos estão commitados corretamente:

```bash
git status
git add .
git commit -m "Preparar para deploy no Vercel"
git push origin main
```

## 2️⃣ Configurar Banco de Dados

### Opção A: Supabase (Recomendado)
1. Criar conta em [supabase.com](https://supabase.com)
2. Criar novo projeto
3. Em `Settings > Database`, copiar a connection string
4. Deve ser no formato: `postgresql://user:password@host:5432/database`

### Opção B: Railway
1. Criar conta em [railway.app](https://railway.app)
2. Criar novo projeto PostgreSQL
3. Copiar `DATABASE_URL` da aba Connect

### Opção C: Neon
1. Criar conta em [neon.tech](https://neon.tech)
2. Criar novo projeto
3. Copiar a connection string em `Connection string`

## 3️⃣ Conectar no Vercel

### Passo 1: Importar Projeto
1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em **"Add New"** → **"Project"**
3. Selecione o repositório GitHub
4. Clique em **"Import"**

### Passo 2: Configurar Variáveis de Ambiente
Na tela de configuração:

1. Role até **"Environment Variables"**
2. Adicione as seguintes variáveis:

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | `postgresql://user:password@host:5432/database` |
| `JWT_SECRET` | Gerar com `openssl rand -hex 32` |
| `FRONTEND_URL` | `https://seu-frontend.vercel.app` |
| `NODE_ENV` | `production` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `seu-email@gmail.com` |
| `SMTP_PASS` | `senha-app-google` |

### Passo 3: Deploy
1. Clique em **"Deploy"**
2. Aguarde o build terminar ✅

## 4️⃣ Configurar Banco de Dados

Depois que o deploy estiver ativo, execute o schema SQL:

```bash
# Se usar psql local:
psql "postgresql://user:password@host:5432/database" -f api/config/schema.sql

# Ou copie o conteúdo de api/config/schema.sql e execute no console do seu banco
```

## 5️⃣ Testar a API

```bash
# Verificar saúde da API
curl https://seu-projeto.vercel.app/api/health

# Deve retornar:
# {"status":"OK","message":"API está funcionando"}
```

## ⚠️ Troubleshooting

### Erro: "Cannot connect to database"
- Verificar se `DATABASE_URL` está correta
- Verificar se o IP do Vercel está permitido no banco (whitelist)
- Testar a conexão localmente com a mesma URL

### Erro: "CORS error"
- Verificar se `FRONTEND_URL` está correta no `.env`
- Certificar que o frontend está usando a URL correta da API

### Erro: "Module not found"
- Executar `npm install` localmente
- Garantir que `package.json` está na raiz do projeto

### Erro no build
- Verificar logs em **Deployments > View Logs**
- Garantir que não há erros de sintaxe
- Verificar `vercel.json` está correto

## 📝 Monitoramento

### Acessar Logs em Tempo Real
```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Ver logs
vercel logs https://seu-projeto.vercel.app
```

### Dashboard Vercel
- Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
- Selecione o projeto
- Veja métricas, logs e deployments

## 🔄 Atualizar Deploy

Toda vez que fizer push para a branch principal:

```bash
git push origin main
```

O Vercel fará o deploy automaticamente!

## 📚 Recursos Adicionais

- [Documentação Vercel](https://vercel.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Node.js na Vercel](https://vercel.com/docs/concepts/functions/serverless-functions)

## ✅ Checklist Final

- [ ] Repositório GitHub criado
- [ ] Todas as variáveis de ambiente configuradas no Vercel
- [ ] DATABASE_URL testada localmente
- [ ] Schema SQL executado no banco
- [ ] Deploy realizado com sucesso
- [ ] API respondendo em `/api/health`
- [ ] CORS configurado corretamente
- [ ] Email funcionando (se necessário)
- [ ] JWT_SECRET configurado

Pronto para produção! 🎉
