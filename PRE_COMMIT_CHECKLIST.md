# ✅ Pre-Commit Checklist - FRcomerce

Use este checklist antes de fazer commit para evitar erros comuns.

## 🔍 Antes de Commitar

- [ ] **Não commitar `.env`** - Arquivo com senhas, nunca deve ir para git
- [ ] **`.env.example` atualizado** - Reflete todas as variáveis necessárias
- [ ] **`node_modules/` não incluído** - Verificar `.gitignore`
- [ ] **Sem `console.log` de senhas** - Remover logs sensíveis
- [ ] **Sem arquivos sensíveis** - Credenciais, chaves privadas, tokens

## 🛠️ Verificar Antes do Deploy

### Código
```bash
# Verificar sintaxe
npm run lint  # Se tiver linter

# Testar localmente
npm run dev

# Testar build
npm run build  # Se aplicável
```

### Variáveis de Ambiente
```bash
# Verificar se DATABASE_URL está correto
echo $DATABASE_URL

# Testar conexão com banco
psql "$(echo $DATABASE_URL)"
```

### Documentação
- [ ] `README.md` atualizado
- [ ] `API_README.md` atualizado
- [ ] Novos endpoints documentados
- [ ] Mudanças em variáveis refletidas em `.env.example`

## 🚀 Antes do Deploy em Produção

- [ ] Todos os testes passando
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] DATABASE_URL testado em produção
- [ ] JWT_SECRET diferente do desenvolvimento
- [ ] NODE_ENV=production
- [ ] FRONTEND_URL apontando para domínio correto
- [ ] SMTP configurado se necessário
- [ ] Logs não mostram senhas ou dados sensíveis

## 📋 Arquivos Críticos

### NÃO Commitar ❌
```
.env
.env.local
.env.*.local
node_modules/
.DS_Store
*.log
.vercel/
```

### SEMPRE Commitar ✅
```
.env.example
package.json
package-lock.json
api/
server.js
vercel.json
.gitignore
README.md
documentação
```

## 🔐 Segurança

### DATABASE_URL
- [ ] Nunca commitar em texto plano
- [ ] Usar variáveis de ambiente no Vercel
- [ ] Testar em dev antes de usar em prod
- [ ] Usar URL diferente para cada ambiente

### JWT_SECRET
- [ ] Gerar novo em produção: `openssl rand -hex 32`
- [ ] Nunca usar mesmo em dev e prod
- [ ] Guardar seguro no Vercel

### SMTP_PASS
- [ ] Usar senha de app (não senha da conta)
- [ ] Nunca commitar
- [ ] Rotar periodicamente

## 🧪 Testes Antes de Push

```bash
# Verificar arquivos não commitados
git status

# Ver o que será commitado
git diff --cached

# Verificar se .env está ignorado
git check-ignore .env

# Listar arquivos que serão enviados
git ls-files
```

## 💾 Workflow Recomendado

```bash
# 1. Fazer mudanças
# 2. Testar localmente
npm run dev

# 3. Verificar status
git status

# 4. Adicionar arquivo (nunca usar git add . sem revisar)
git add arquivo-modificado.js

# 5. Verificar staged
git diff --cached

# 6. Commit com mensagem descritiva
git commit -m "feat: adicionar novo endpoint"

# 7. Push
git push origin main

# 8. Vercel fará deploy automaticamente
```

## 🆘 Se Commitar Errado

### Acidentalmente commitar .env
```bash
# Remover do histórico (CUIDADO!)
git rm --cached .env
git commit --amend

# Depois regenerar segredos!
```

### Commitar com senha no código
```bash
# Remover do histórico
git filter-branch --tree-filter 'rm -f arquivo' HEAD

# Depois mudar a senha!
```

## ✨ Último Check

Antes de fazer `git push`:

```bash
# Rodar este script
echo "=== Verificando .env ===" && \
git check-ignore .env && echo "✅ .env está ignorado" || echo "❌ .env NÃO está ignorado" && \
echo "=== Verificando node_modules ===" && \
git check-ignore node_modules && echo "✅ node_modules está ignorado" || echo "❌ ERRO!" && \
echo "=== Arquivos a commitar ===" && \
git diff --cached --name-only && \
echo "=== Pronto! ===" && \
echo "Se tudo OK, pode fazer: git push origin main"
```

Segurança em primeiro lugar! 🔒
