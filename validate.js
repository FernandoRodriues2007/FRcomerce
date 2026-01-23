#!/usr/bin/env node

/**
 * 🔍 Validador de Projeto - FRcomerce
 * Verifica se tudo está configurado corretamente para rodar a API
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

function check(condition, passMsg, failMsg = null) {
  if (condition) {
    console.log(`  ${colors.green}✅${colors.reset} ${passMsg}`);
    return true;
  } else {
    const message = failMsg || passMsg;
    console.log(`  ${colors.red}❌${colors.reset} ${message}`);
    return false;
  }
}

function info(msg) {
  console.log(`  ${colors.blue}ℹ️ ${msg}${colors.reset}`);
}

function warn(msg) {
  console.log(`  ${colors.yellow}⚠️  ${msg}${colors.reset}`);
}

async function validate() {
  let allChecks = [];
  let passedChecks = 0;

  log('\n╔═══════════════════════════════════════════════╗', 'blue');
  log('║  🔍 VALIDADOR DE CONFIGURAÇÃO - FRCOMERCE  ║', 'blue');
  log('╚═══════════════════════════════════════════════╝\n', 'blue');

  // 1. Arquivos Críticos
  log('📂 1. Verificando Arquivos Críticos', 'bright');
  
  const criticalFiles = [
    'api/config/database.js',
    'api/package.json',
    'api/config/schema.sql',
    'server.js',
  ];
  
  for (const file of criticalFiles) {
    const filePath = path.join(__dirname, file);
    const result = check(fs.existsSync(filePath), `Arquivo: ${file}`);
    allChecks.push(result);
    if (result) passedChecks++;
  }

  // 2. Pastas Obrigatórias
  log('\n📁 2. Verificando Pastas Obrigatórias', 'bright');
  
  const requiredFolders = [
    'api/config',
    'api/controllers',
    'api/models',
    'api/routes',
    'api/middlewares',
    'E-comerc',
  ];
  
  for (const folder of requiredFolders) {
    const folderPath = path.join(__dirname, folder);
    const result = check(fs.existsSync(folderPath), `Pasta: ${folder}/`);
    allChecks.push(result);
    if (result) passedChecks++;
  }

  // 3. Dependências npm
  log('\n📦 3. Verificando Dependências npm', 'bright');
  
  const packageJsonPath = path.join(__dirname, 'api', 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const requiredDeps = ['express', 'pg', 'dotenv', 'cors', 'bcryptjs', 'jsonwebtoken'];
    
    const nodeModulesPath = path.join(__dirname, 'api', 'node_modules');
    const nodeModulesExist = fs.existsSync(nodeModulesPath);
    
    if (nodeModulesExist) {
      info('node_modules instalado');
      passedChecks++;
    } else {
      warn('node_modules não encontrado. Execute: cd api && npm install');
    }
    allChecks.push(nodeModulesExist);
    
    for (const dep of requiredDeps) {
      const exists = packageJson.dependencies && packageJson.dependencies[dep];
      const result = check(exists, `Dependência: ${dep}`);
      allChecks.push(result);
      if (result) passedChecks++;
    }
  }

  // 4. Configuração de Ambiente
  log('\n⚙️  4. Verificando Configuração (.env)', 'bright');
  
  const envPath = path.join(__dirname, 'api', '.env');
  const envExamplePath = path.join(__dirname, 'api', '.env.example');
  
  const envExists = check(fs.existsSync(envPath), 'Arquivo .env existe');
  allChecks.push(envExists);
  if (envExists) passedChecks++;
  
  if (!envExists && fs.existsSync(envExamplePath)) {
    warn('Copie .env.example para .env: copy api\\.env.example api\\.env');
  }
  
  if (envExists) {
    dotenv.config({ path: envPath });
    
    const requiredEnvVars = [
      { name: 'DB_USER', sensitive: false },
      { name: 'DB_PASSWORD', sensitive: true },
      { name: 'DB_HOST', sensitive: false },
      { name: 'DB_PORT', sensitive: false },
      { name: 'DB_NAME', sensitive: false },
      { name: 'JWT_SECRET', sensitive: true },
    ];

    for (const varInfo of requiredEnvVars) {
      const value = process.env[varInfo.name];
      let displayValue = value ? (varInfo.sensitive ? '***' : value) : 'NÃO DEFINIDA';
      const exists = !!value;
      const result = check(exists, `${varInfo.name}: ${displayValue}`);
      allChecks.push(result);
      if (result) passedChecks++;
    }
  }

  // 5. Testar Conexão com Banco de Dados
  log('\n🗄️  5. Testando Conexão com Banco de Dados', 'bright');
  
  if (envExists) {
    try {
      const user = process.env.DB_USER || 'postgres';
      const password = process.env.DB_PASSWORD;
      const host = process.env.DB_HOST || 'localhost';
      const port = process.env.DB_PORT || 5432;
      const database = process.env.DB_NAME || 'frcomerce';

      let connectionString;
      if (password) {
        connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;
      } else {
        connectionString = `postgresql://${user}@${host}:${port}/${database}`;
      }

      info(`Conectando em: postgresql://${user}@${host}:${port}/${database}`);

      const pool = new pg.Pool({
        connectionString,
        statement_timeout: 5000,
      });

      await new Promise((resolve, reject) => {
        pool.query('SELECT 1', (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      const result = check(true, 'Conexão com banco de dados: ✅ OK');
      allChecks.push(result);
      if (result) passedChecks++;

      // Verificar tabelas
      const tablesResult = await pool.query(`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      
      const tables = tablesResult.rows.map(r => r.table_name);
      const expectedTables = ['usuarios', 'produtos', 'pedidos'];
      
      if (tables.length > 0) {
        info(`Tabelas encontradas: ${tables.join(', ')}`);
      } else {
        warn('Nenhuma tabela encontrada. Execute: psql -U postgres -d frcomerce -f api/config/schema.sql');
      }
      
      for (const table of expectedTables) {
        const exists = tables.includes(table);
        const result = check(exists, `Tabela ${table}`);
        allChecks.push(result);
        if (result) passedChecks++;
      }
      
      await pool.end();
    } catch (error) {
      console.log(`  ${colors.red}❌${colors.reset} Conexão com banco de dados FALHOU`);
      console.log(`     Erro: ${error.message}`);
      warn('Certifique-se de que:');
      warn('  1. PostgreSQL está instalado e rodando');
      warn('  2. O banco "frcomerce" foi criado');
      warn('  3. As credenciais em .env estão corretas');
      warn('  4. Execute: createdb -U postgres frcomerce');
      allChecks.push(false);
    }
  }

  // 6. Resumo Final
  log('\n' + '═'.repeat(50), 'gray');
  
  const totalChecks = allChecks.length;
  const percentage = Math.round((passedChecks / totalChecks) * 100);
  
  if (passedChecks === totalChecks) {
    log(`\n✅ TUDO CONFIGURADO CORRETAMENTE! (${passedChecks}/${totalChecks})`, 'green');
    log('\n🚀 Você pode iniciar a API com:');
    log('   npm run dev   (modo desenvolvimento)', 'yellow');
    log('   npm start     (modo produção)\n', 'yellow');
  } else if (passedChecks >= totalChecks * 0.7) {
    log(`\n⚠️  FALTAM ALGUMAS CONFIGURAÇÕES (${passedChecks}/${totalChecks} - ${percentage}%)`, 'yellow');
    log('\nVerifique os itens marcados acima com ❌\n', 'gray');
  } else {
    log(`\n❌ MUITAS CONFIGURAÇÕES FALTAM (${passedChecks}/${totalChecks} - ${percentage}%)`, 'red');
    log('\nExecute esses comandos em ordem:', 'yellow');
    log('  1. node init.js', 'yellow');
    log('  2. createdb -U postgres frcomerce', 'yellow');
    log('  3. psql -U postgres -d frcomerce -f api/config/schema.sql', 'yellow');
    log('  4. Edite api/.env com suas credenciais', 'yellow');
    log('  5. npm run dev\n', 'yellow');
  }
  
  log('═'.repeat(50) + '\n', 'gray');
  
  process.exit(passedChecks === totalChecks ? 0 : 1);
}

// Executar validação
validate().catch(err => {
  console.error(`${colors.red}❌ Erro:${colors.reset}`, err.message);
  process.exit(1);
});
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
