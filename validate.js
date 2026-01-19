#!/usr/bin/env node

/**
 * 🔍 Validador de Projeto - FRcomerce
 * Verifica se tudo está configurado corretamente
 */

import fs from 'fs';
import path from 'path';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function check(condition, passMsg, failMsg) {
  if (condition) {
    console.log(`  ${colors.green}✅${colors.reset} ${passMsg}`);
    return true;
  } else {
    console.log(`  ${colors.red}❌${colors.reset} ${failMsg}`);
    return false;
  }
}

async function validate() {
  let totalChecks = 0;
  let passedChecks = 0;

  log('\n╔════════════════════════════════════════╗', 'blue');
  log('║  🔍 Validador - FRcomerce             ║', 'blue');
  log('╚════════════════════════════════════════╝\n', 'blue');

  // 1. Arquivos Críticos
  log('📂 Verificando Arquivos Críticos', 'bright');
  
  const criticalFiles = [
    'api/config/database.js',
    'api/generate-env.js',
    'api/package.json',
    'server.js',
    'vercel.json',
    '.env.example',
    '.gitignore',
  ];

  for (const file of criticalFiles) {
    totalChecks++;
    if (check(
      fs.existsSync(path.join(process.cwd(), file)),
      `${file} existe`,
      `${file} NÃO encontrado`
    )) {
      passedChecks++;
    }
  }

  // 2. Documentação
  log('\n📚 Verificando Documentação', 'bright');

  const docFiles = [
    'README.md',
    'API_README.md',
    'QUICK_START.md',
    'VERCEL_DEPLOYMENT.md',
    'MIGRACAO_DATABASE_URL.md',
    'PRE_COMMIT_CHECKLIST.md',
  ];

  for (const file of docFiles) {
    totalChecks++;
    if (check(
      fs.existsSync(path.join(process.cwd(), file)),
      `${file} existe`,
      `${file} NÃO encontrado`
    )) {
      passedChecks++;
    }
  }

  // 3. Verificar .gitignore
  log('\n🔐 Verificando Segurança', 'bright');

  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
    
    totalChecks++;
    if (check(
      gitignoreContent.includes('.env'),
      '.env está ignorado',
      '.env NÃO está ignorado (CRÍTICO!)'
    )) {
      passedChecks++;
    }

    totalChecks++;
    if (check(
      gitignoreContent.includes('node_modules'),
      'node_modules está ignorado',
      'node_modules NÃO está ignorado'
    )) {
      passedChecks++;
    }
  }

  // 4. Verificar DATABASE_URL em .env.example
  log('\n🗄️  Verificando DATABASE_URL', 'bright');

  const envExamplePath = path.join(process.cwd(), '.env.example');
  if (fs.existsSync(envExamplePath)) {
    const envExampleContent = fs.readFileSync(envExamplePath, 'utf-8');
    
    totalChecks++;
    if (check(
      envExampleContent.includes('DATABASE_URL'),
      '.env.example usa DATABASE_URL',
      '.env.example ainda usa variáveis antigas'
    )) {
      passedChecks++;
    }

    totalChecks++;
    if (check(
      !envExampleContent.includes('DB_HOST') && !envExampleContent.includes('DB_PASSWORD'),
      'Sem variáveis antigas em .env.example',
      'Ainda há variáveis antigas em .env.example'
    )) {
      passedChecks++;
    }
  }

  // 5. Verificar database.js
  log('\n⚙️  Verificando Configuração', 'bright');

  const databasePath = path.join(process.cwd(), 'api/config/database.js');
  if (fs.existsSync(databasePath)) {
    const dbContent = fs.readFileSync(databasePath, 'utf-8');
    
    totalChecks++;
    if (check(
      dbContent.includes('DATABASE_URL'),
      'database.js usa DATABASE_URL',
      'database.js não usa DATABASE_URL'
    )) {
      passedChecks++;
    }
  }

  // 6. Verificar vercel.json
  log('\n🚀 Verificando Configuração Vercel', 'bright');

  const vercelPath = path.join(process.cwd(), 'vercel.json');
  if (fs.existsSync(vercelPath)) {
    const vercelContent = fs.readFileSync(vercelPath, 'utf-8');
    
    totalChecks++;
    if (check(
      vercelContent.includes('@database_url'),
      'vercel.json usa @database_url',
      'vercel.json não referencia @database_url'
    )) {
      passedChecks++;
    }

    totalChecks++;
    if (check(
      !vercelContent.includes('@db_host'),
      'vercel.json sem variáveis antigas',
      'vercel.json ainda tem variáveis antigas'
    )) {
      passedChecks++;
    }
  }

  // 7. Verificar generate-env.js
  log('\n🔧 Verificando Script de Setup', 'bright');

  const genEnvPath = path.join(process.cwd(), 'api/generate-env.js');
  if (fs.existsSync(genEnvPath)) {
    const genEnvContent = fs.readFileSync(genEnvPath, 'utf-8');
    
    totalChecks++;
    if (check(
      genEnvContent.includes('DATABASE_URL'),
      'generate-env.js gera DATABASE_URL',
      'generate-env.js não usa DATABASE_URL'
    )) {
      passedChecks++;
    }
  }

  // Resultado Final
  log('\n' + '='.repeat(45), 'gray');
  log(`\n📊 Resultado: ${passedChecks}/${totalChecks} verificações passaram\n`, 'bright');

  if (passedChecks === totalChecks) {
    log('✨ TUDO PERFEITO! Projeto 100% pronto! ✨\n', 'green');
    log('Próximos passos:', 'bright');
    log('  1. npm run setup (gerar .env)', 'gray');
    log('  2. createdb frcomerce', 'gray');
    log('  3. npm run dev (na pasta api)', 'gray');
    process.exit(0);
  } else {
    log(`⚠️  ${totalChecks - passedChecks} verificação(ões) falharam`, 'yellow');
    log('\nVerifique os itens marcados com ❌\n', 'yellow');
    process.exit(1);
  }
}

validate().catch((err) => {
  log(`\n❌ Erro: ${err.message}\n`, 'red');
  process.exit(1);
});
