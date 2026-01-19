# 🔄 Guia de Migração: DATABASE_URL

## O que mudou?

A partir desta versão, o projeto usa `DATABASE_URL` em vez de variáveis individuais de banco de dados para melhor compatibilidade com serviços de hosting como Vercel, Railway e Supabase.

## Variáveis Antigas ❌
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=frcomerce
```

## Variável Nova ✅
```env
DATABASE_URL=postgresql://postgres:sua_senha@localhost:5432/frcomerce
```

## Como Migrar?

### 1. Atualizar `.env` Existente

Se já tem um `.env` com as variáveis antigas:

**Antes:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=suaSenha123
DB_NAME=frcomerce
```

**Depois:**
```env
DATABASE_URL=postgresql://postgres:suaSenha123@localhost:5432/frcomerce
```

### 2. Formato DATABASE_URL

A URL segue o padrão:
```
postgresql://[username]:[password]@[host]:[port]/[database]
```

**Exemplos:**

- **Local:**
  ```
  postgresql://postgres:senha@localhost:5432/frcomerce
  ```

- **Supabase:**
  ```
  postgresql://postgres.xxxxx:password@db.xxxxx.supabase.co:5432/postgres
  ```

- **Railway:**
  ```
  postgresql://root:password@containers.railway.app:7899/railway
  ```

- **Neon:**
  ```
  postgresql://user:password@ep-xxx.us-east-1.neon.tech/neondb
  ```

### 3. Regenerar `.env`

Se prefere gerar um novo `.env`:

```bash
npm run setup
```

O script pedirá a `DATABASE_URL` completa e gerará o arquivo corretamente.

## Benefícios 🎯

| Benefício | Descrição |
|-----------|-----------|
| **Vercel Ready** | Compatível nativamente com Vercel |
| **Padrão Moderno** | Segue práticas de deployment cloud |
| **Simples** | Uma variável em vez de cinco |
| **Seguro** | A senha está encapsulada na URL |
| **Universal** | Funciona com qualquer provedor PostgreSQL |

## Verificação ✅

Para verificar se está correto:

```bash
# Teste a conexão (Node.js)
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```

Deve exibir a URL completa.

## Em Caso de Problemas 🔧

### URL não está sendo lida
- Verifique se `.env` está na raiz do projeto
- Execute `npm install dotenv` se necessário
- Reinicie o servidor

### Conexão recusada
- Teste a URL em um cliente PostgreSQL (pgAdmin, DBeaver)
- Verifique credenciais
- Confirme que o banco está acessível

### Caracteres especiais na senha
Se sua senha tem caracteres especiais, deve ser URL-encoded:

```
! = %21
@ = %40
# = %23
$ = %24
% = %25
& = %26
```

**Exemplo:**
```
Senha: abc@123!
URL: postgresql://user:abc%40123%21@host:5432/db
```

## Arquivos Modificados 📝

- ✅ `.env.example` - Atualizado com `DATABASE_URL`
- ✅ `api/config/database.js` - Já usa `DATABASE_URL`
- ✅ `api/generate-env.js` - Gera `DATABASE_URL`
- ✅ `vercel.json` - Configurado para `DATABASE_URL`
- ✅ `API_README.md` - Documentação atualizada
- ✅ `AUTOMACAO_EXPLICADA.md` - Fluxo atualizado

## Testes Recomendados 🧪

```bash
# 1. Instalar dependências
npm install

# 2. Gerar .env
npm run setup

# 3. Iniciar servidor
npm run dev

# 4. Testar API
curl http://localhost:3000/api/health
# Deve retornar: {"status":"OK","message":"API está funcionando"}
```

## Suporte 🆘

Se encontrar problemas:

1. Verifique o formato da URL
2. Teste com um cliente SQL direto
3. Verifique os logs: `npm run dev`
4. Consulte a documentação do seu provedor de banco

Tudo pronto! 🚀
