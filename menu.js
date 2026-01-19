#!/usr/bin/env node

/**
 * 🎯 Menu Interativo - FRcomerce
 * Ajuda rápida com opções do projeto
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function showHeader() {
  console.clear();
  log('\n╔═══════════════════════════════════════════════╗', 'blue');
  log('║                                               ║', 'blue');
  log('║         🎯 FRcomerce - Menu Principal          ║', 'blue');
  log('║                                               ║', 'blue');
  log('╚═══════════════════════════════════════════════╝\n', 'blue');
}

function showMenu() {
  log('Escolha uma opção:\n', 'bright');
  
  log('1️⃣   Começar rápido (Quick Start)', 'green');
  log('2️⃣   Setup automático completo', 'green');
  log('3️⃣   Deploy no Vercel', 'green');
  log('4️⃣   Gerar senhas de app', 'green');
  log('5️⃣   Entender DATABASE_URL', 'green');
  log('6️⃣   Checklist antes de commitar', 'green');
  log('7️⃣   Ver status do projeto', 'green');
  log('8️⃣   Referência rápida de comandos', 'green');
  log('0️⃣   Sair\n', 'gray');
}

function handleOption(choice) {
  switch (choice) {
    case '1':
      showQuickStart();
      break;
    case '2':
      showFullSetup();
      break;
    case '3':
      showVercelDeploy();
      break;
    case '4':
      showPasswordGeneration();
      break;
    case '5':
      showDatabaseUrl();
      break;
    case '6':
      showCommitChecklist();
      break;
    case '7':
      showStatus();
      break;
    case '8':
      showCommands();
      break;
    case '0':
      log('\n👋 Até logo!\n', 'yellow');
      process.exit(0);
    default:
      log('\n❌ Opção inválida!\n', 'gray');
  }
}

function showQuickStart() {
  console.clear();
  log('⚡ QUICK START\n', 'bright');
  
  log('3 passos para começar:\n', 'yellow');
  
  log('$ node init.js', 'green');
  log('   └─ Instala dependências e gera .env\n', 'gray');
  
  log('$ createdb frcomerce', 'green');
  log('$ psql -U postgres -d frcomerce -f api/config/schema.sql', 'green');
  log('   └─ Cria banco de dados\n', 'gray');
  
  log('$ cd api && npm run dev', 'green');
  log('   └─ Inicia servidor\n', 'gray');
  
  log('✅ Pronto! API em http://localhost:3000\n', 'green');
  
  askContinue();
}

function showFullSetup() {
  console.clear();
  log('🔧 SETUP AUTOMÁTICO COMPLETO\n', 'bright');
  
  log('Passo 1: Instalar dependências', 'yellow');
  log('  $ cd api && npm install\n', 'gray');
  
  log('Passo 2: Setup interativo', 'yellow');
  log('  $ npm run setup', 'green');
  log('  → Pergunta: DATABASE_URL', 'gray');
  log('  → Pergunta: Email (Gmail ou Mailhog)', 'gray');
  log('  → Gera JWT_SECRET automaticamente\n', 'gray');
  
  log('Passo 3: Configurar banco de dados', 'yellow');
  log('  $ createdb frcomerce', 'green');
  log('  $ psql -U postgres -d frcomerce -f api/config/schema.sql\n', 'gray');
  
  log('Passo 4: Iniciar servidor', 'yellow');
  log('  $ npm run dev\n', 'gray');
  
  log('✅ Tudo configurado!\n', 'green');
  
  askContinue();
}

function showVercelDeploy() {
  console.clear();
  log('🚀 DEPLOY NO VERCEL\n', 'bright');
  
  log('1. Commit & Push', 'yellow');
  log('   $ git add .\n', 'gray');
  log('   $ git commit -m "msg"\n', 'gray');
  log('   $ git push origin main\n', 'gray');
  
  log('2. Conectar no Vercel', 'yellow');
  log('   → https://vercel.com/dashboard\n', 'gray');
  log('   → "Add New" → "Project"\n', 'gray');
  log('   → Selecione repositório\n', 'gray');
  
  log('3. Variáveis de Ambiente', 'yellow');
  log('   DATABASE_URL = sua-connection-string', 'green');
  log('   JWT_SECRET = gere com: openssl rand -hex 32', 'green');
  log('   FRONTEND_URL = seu-dominio.vercel.app\n', 'green');
  
  log('4. Deploy!', 'yellow');
  log('   → Clique "Deploy"\n', 'gray');
  
  log('📚 Guia completo em: VERCEL_DEPLOYMENT.md\n', 'yellow');
  
  askContinue();
}

function showPasswordGeneration() {
  console.clear();
  log('🔐 GERAR SENHAS DE APP\n', 'bright');
  
  log('Opção 1: 5 senhas padrão', 'yellow');
  log('  $ cd api', 'gray');
  log('  $ npm run generate:password\n', 'green');
  
  log('Opção 2: 10 senhas', 'yellow');
  log('  $ npm run generate:passwords\n', 'green');
  
  log('Opção 3: Customizado', 'yellow');
  log('  $ node generate-app-password.js 3 20', 'green');
  log('    (3 senhas de 20 caracteres)\n', 'gray');
  
  log('💡 Use essas senhas em:', 'blue');
  log('   - SMTP_PASS (para email)', 'gray');
  log('   - JWT_SECRET (para tokens)', 'gray');
  log('   - Outras configurações sensíveis\n', 'gray');
  
  askContinue();
}

function showDatabaseUrl() {
  console.clear();
  log('🗄️  ENTENDER DATABASE_URL\n', 'bright');
  
  log('Formato:', 'yellow');
  log('  postgresql://[user]:[password]@[host]:[port]/[database]\n', 'green');
  
  log('Exemplos:\n', 'yellow');
  
  log('Local:', 'blue');
  log('  postgresql://postgres:senha@localhost:5432/frcomerce\n', 'green');
  
  log('Supabase:', 'blue');
  log('  postgresql://postgres.xxxxx:senha@db.xxxxx.supabase.co:5432/postgres\n', 'green');
  
  log('Railway:', 'blue');
  log('  postgresql://root:senha@containers.railway.app:7899/railway\n', 'green');
  
  log('Neon:', 'blue');
  log('  postgresql://user:senha@ep-xxx.us-east-1.neon.tech/neondb\n', 'green');
  
  log('📚 Guia completo em: MIGRACAO_DATABASE_URL.md\n', 'yellow');
  
  askContinue();
}

function showCommitChecklist() {
  console.clear();
  log('✅ CHECKLIST ANTES DE COMMITAR\n', 'bright');
  
  log('Segurança:\n', 'yellow');
  log('  ☐ .env NÃO será commitado (.gitignore)', 'gray');
  log('  ☐ .env.example não tem senhas reais', 'gray');
  log('  ☐ Sem console.log de senhas', 'gray');
  log('  ☐ Sem dados sensíveis\n', 'gray');
  
  log('Código:\n', 'yellow');
  log('  ☐ Sem console.log de debug', 'gray');
  log('  ☐ Sem TODOs importantes', 'gray');
  log('  ☐ Código testado localmente', 'gray');
  log('  ☐ npm run dev funciona\n', 'gray');
  
  log('Documentação:\n', 'yellow');
  log('  ☐ README.md atualizado', 'gray');
  log('  ☐ .env.example reflete variáveis', 'gray');
  log('  ☐ Comentários no código\n', 'gray');
  
  log('Commands:\n', 'green');
  log('  $ git status', 'gray');
  log('  $ git diff --cached', 'gray');
  log('  $ git check-ignore .env\n', 'gray');
  
  log('📚 Checklist completo em: PRE_COMMIT_CHECKLIST.md\n', 'yellow');
  
  askContinue();
}

function showStatus() {
  console.clear();
  log('📊 STATUS DO PROJETO\n', 'bright');
  
  log('Executando validação...', 'yellow');
  
  try {
    const validResult = require('child_process').execSync('node validate.js 2>&1', { 
      cwd: process.cwd() 
    }).toString();
    
    console.log(validResult);
  } catch (error) {
    log('\n❌ Erro ao executar validação\n', 'red');
    log('Execute: node validate.js\n', 'gray');
  }
  
  askContinue();
}

function showCommands() {
  console.clear();
  log('🔧 REFERÊNCIA RÁPIDA DE COMANDOS\n', 'bright');
  
  log('Setup:', 'yellow');
  log('  node init.js                 # Setup automático', 'green');
  log('  cd api && npm run setup       # Setup interativo', 'green');
  log('  npm install                   # Instalar dependências\n', 'gray');
  
  log('Desenvolvimento:', 'yellow');
  log('  npm run dev                   # Modo watch (hot reload)', 'green');
  log('  npm start                     # Produção', 'green');
  log('  npm run generate:password     # Gerar 5 senhas\n', 'gray');
  
  log('Banco de Dados:', 'yellow');
  log('  createdb frcomerce            # Criar BD', 'green');
  log('  psql -U postgres -d frcomerce -f api/config/schema.sql', 'green');
  log('    └─ Executar schema\n', 'gray');
  
  log('Git:', 'yellow');
  log('  git status                    # Ver mudanças', 'green');
  log('  git add .                     # Preparar', 'green');
  log('  git commit -m "msg"           # Commitar', 'green');
  log('  git push origin main          # Enviar\n', 'gray');
  
  log('Validação:', 'yellow');
  log('  node validate.js              # Validar projeto\n', 'gray');
  
  askContinue();
}

function askContinue() {
  rl.question(`\n${colors.yellow}Pressione ENTER para continuar...${colors.reset}`, () => {
    showHeader();
    showMenu();
    rl.question(`${colors.bright}Escolha uma opção (0-8): ${colors.reset}`, (choice) => {
      handleOption(choice);
    });
  });
}

function start() {
  showHeader();
  showMenu();
  
  rl.question(`${colors.bright}Escolha uma opção (0-8): ${colors.reset}`, (choice) => {
    handleOption(choice);
  });
}

start();
