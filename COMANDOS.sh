#!/bin/bash

##############################################################################
#                                                                            #
#  FRcomerce - Scripts de Desenvolvimento                                  #
#                                                                            #
#  Use este arquivo como referência para os comandos mais utilizados       #
#                                                                            #
##############################################################################

echo "🚀 FRcomerce - Scripts de Desenvolvimento"
echo "==========================================="
echo ""

# ============================================================================
# 1. SETUP INICIAL
# ============================================================================

echo "📦 SETUP INICIAL"
echo "================"
echo ""
echo "# Opção 1: Setup Completo Automático"
echo "node init.js"
echo ""
echo "# Opção 2: Setup Interativo da API"
echo "cd api && npm run setup"
echo ""
echo "# Opção 3: Instalar dependências manualmente"
echo "cd api && npm install"
echo ""

# ============================================================================
# 2. GERAR SENHAS E CONFIGURAÇÕES
# ============================================================================

echo "🔐 GERAR SENHAS"
echo "==============="
echo ""
echo "# Gerar 5 senhas de 16 caracteres (padrão)"
echo "cd api && npm run generate:password"
echo ""
echo "# Gerar 10 senhas de 16 caracteres"
echo "cd api && npm run generate:passwords"
echo ""
echo "# Gerar senhas customizadas (3 senhas de 20 caracteres)"
echo "cd api && node generate-app-password.js 3 20"
echo ""
echo "# Resultado:"
echo "# 🔐 Gerador de Senha de App (Google/Email)"
echo "# "
echo "# Senhas Geradas:"
echo "# "
echo "#   1. a7B#kL9\$mN@4pQ2&vW5!xZ"
echo "#   2. c3D%eF1!hJ@7kL4\$mN9&pQ"
echo "#   3. r5S#tU2@vW8\$xY1!zA3%bC"
echo ""

# ============================================================================
# 3. CONFIGURAR BANCO DE DADOS
# ============================================================================

echo "🗄️  BANCO DE DADOS"
echo "================="
echo ""
echo "# Criar banco de dados"
echo "createdb frcomerce"
echo ""
echo "# Importar schema"
echo "psql -U postgres -d frcomerce -f api/config/schema.sql"
echo ""
echo "# Listar tabelas (verificar)"
echo "psql -U postgres -d frcomerce -c \"\\dt\""
echo ""
echo "# Deletar banco (cuidado!)"
echo "dropdb frcomerce"
echo ""

# ============================================================================
# 4. DESENVOLVIMENTO
# ============================================================================

echo "🚀 DESENVOLVIMENTO"
echo "=================="
echo ""
echo "# Iniciar API com auto-reload (nodemon)"
echo "cd api && npm run dev"
echo ""
echo "# Iniciar API em modo produção"
echo "cd api && npm start"
echo ""
echo "# Testar health check"
echo "curl http://localhost:3000/api/health"
echo ""

# ============================================================================
# 5. TESTES COM cURL
# ============================================================================

echo "🧪 TESTES COM cURL"
echo "=================="
echo ""
echo "# 1. REGISTRAR USUÁRIO"
echo "curl -X POST http://localhost:3000/api/auth/registrar \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"nome\": \"João Silva\","
echo "    \"email\": \"joao@example.com\","
echo "    \"senha\": \"senha123\""
echo "  }'"
echo ""

echo "# 2. FAZER LOGIN"
echo "curl -X POST http://localhost:3000/api/auth/login \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"email\": \"joao@example.com\","
echo "    \"senha\": \"senha123\""
echo "  }'"
echo ""
echo "# Resultado: {\"token\": \"jwt-token-aqui\", ...}"
echo ""

echo "# 3. OBTER PERFIL (use o token acima)"
echo "curl -X GET http://localhost:3000/api/usuario/me \\"
echo "  -H \"Authorization: Bearer JWT-TOKEN-AQUI\""
echo ""

echo "# 4. LISTAR PRODUTOS"
echo "curl http://localhost:3000/api/produtos"
echo ""

echo "# 5. RECUPERAR SENHA"
echo "curl -X POST http://localhost:3000/api/password/recuperar-senha \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"email\": \"joao@example.com\"}'"
echo ""

# ============================================================================
# 6. CONFIGURAR EMAIL
# ============================================================================

echo "📧 CONFIGURAR EMAIL"
echo "==================="
echo ""
echo "# Opção A: Gmail com App Password"
echo "1. Acesse: https://myaccount.google.com/apppasswords"
echo "2. Selecione Mail + Windows Computer"
echo "3. Copie a senha (16 caracteres)"
echo "4. Cole em api/.env como SMTP_PASS=xxx"
echo ""

echo "# Opção B: Usar script para gerar"
echo "cd api && npm run generate:password"
echo "# Copiar resultado para SMTP_PASS"
echo ""

echo "# Opção C: Mailhog para testes"
echo "docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog"
echo "# Visualize em http://localhost:8025"
echo ""

# ============================================================================
# 7. EDITAR .env
# ============================================================================

echo "⚙️  EDITAR VARIÁVEIS DE AMBIENTE"
echo "==============================="
echo ""
echo "# Abrir arquivo .env no editor"
echo "cd api && code .env"
echo ""
echo "# Ou com vim"
echo "cd api && vim .env"
echo ""
echo "# Campos obrigatórios a configurar:"
echo "  - DB_PASSWORD (sua senha PostgreSQL)"
echo "  - SMTP_USER (seu email Gmail ou remover para Mailhog)"
echo "  - JWT_SECRET (já gerado)"
echo "  - SMTP_PASS (já gerado ou colar senha do Gmail)"
echo ""

# ============================================================================
# 8. FRONTEND
# ============================================================================

echo "🎨 FRONTEND"
echo "==========="
echo ""
echo "# Atualizar URL da API (em cada arquivo .js)"
echo "const API_URL = 'http://localhost:3000/api';"
echo ""
echo "# Para produção (Vercel):"
echo "const API_URL = 'https://seu-backend.vercel.app/api';"
echo ""

# ============================================================================
# 9. DEPLOY NA VERCEL
# ============================================================================

echo "🚢 DEPLOY NA VERCEL"
echo "==================="
echo ""
echo "# 1. Fazer commit"
echo "git add ."
echo "git commit -m 'FRcomerce - Projeto completo'"
echo "git push"
echo ""
echo "# 2. Ir para https://vercel.com"
echo "# 3. Clicar \"Import Project\""
echo "# 4. Selecionar repositório GitHub"
echo "# 5. Adicionar variáveis de ambiente:"
echo "   DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME"
echo "   JWT_SECRET, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS"
echo "   FRONTEND_URL, NODE_ENV"
echo "# 6. Clicar \"Deploy\""
echo ""

# ============================================================================
# 10. TROUBLESHOOTING
# ============================================================================

echo "🐛 TROUBLESHOOTING"
echo "=================="
echo ""
echo "# Erro: ECONNREFUSED (banco não conecta)"
echo "## PostgreSQL não está rodando"
echo "## Solução: Inicie PostgreSQL"
echo "pg_ctl -D /usr/local/var/postgres start  # macOS"
echo "## ou use: brew services start postgresql"
echo ""

echo "# Erro: database \"frcomerce\" does not exist"
echo "## Solução: Criar banco"
echo "createdb frcomerce"
echo ""

echo "# Erro: Porta 3000 já em uso"
echo "## Opção 1: Mudar PORT em .env"
echo "## Opção 2: Matar processo na porta"
echo "lsof -t -i:3000 | xargs kill -9  # macOS/Linux"
echo ""

echo "# Erro: 'npm run setup' não funciona"
echo "## Solução: Entrar na pasta api primeiro"
echo "cd api"
echo "npm run setup"
echo ""

echo "# Email não funciona"
echo "## Verifique SMTP_USER e SMTP_PASS"
echo "## Para Gmail: Use app password, não senha comum"
echo "## Para Mailhog: Execute docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog"
echo ""

# ============================================================================
# 11. ESTRUTURA DO PROJETO
# ============================================================================

echo "📁 ESTRUTURA DO PROJETO"
echo "======================="
echo ""
echo "FRcomerce/"
echo "├── api/                                # Backend Express"
echo "│   ├── config/database.js"
echo "│   ├── controllers/                    # Lógica"
echo "│   ├── models/                         # Dados"
echo "│   ├── routes/                         # URLs"
echo "│   ├── middlewares/                    # Auth"
echo "│   ├── package.json"
echo "│   ├── server.js"
echo "│   ├── generate-env.js                 # Setup"
echo "│   └── generate-app-password.js        # Gerar senhas"
echo "├── E-comerc/                           # Frontend"
echo "│   ├── index.html"
echo "│   ├── login.html"
echo "│   ├── criarconta.html"
echo "│   ├── recuperarSenha.html"
echo "│   ├── resetarSenha.html"
echo "│   ├── principal.html"
echo "│   └── assets/js/                      # Scripts"
echo "├── init.js                             # Setup automático"
echo "├── README.md                           # Documentação"
echo "├── QUICK_START.md                      # Este arquivo"
echo "├── SETUP_AUTOMATIZADO.md               # Detalhado"
echo "├── API_README.md                       # API docs"
echo "└── RECUPERAR_SENHA_GUIA.md             # Recuperação"
echo ""

# ============================================================================

echo "✅ Use estes comandos para desenvolver!"
echo ""
echo "Para mais informações, consulte:"
echo "  - QUICK_START.md (referência rápida)"
echo "  - SETUP_AUTOMATIZADO.md (detalhado)"
echo "  - API_README.md (documentação da API)"
echo ""
