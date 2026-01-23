#!/usr/bin/env node

/**
 * Script de inicialização completa do projeto
 * Faz todo o setup necessário para rodar a API
 * 
 * Uso: node init.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    gray: '\x1b[90m',
};

function log(mensagem, cor = 'reset') {
    console.log(`${colors[cor]}${mensagem}${colors.reset}`);
}

function logStep(numero, titulo) {
    log(`\n${numero}. ${titulo}`, 'bright');
    log('─'.repeat(60), 'gray');
}

function logSuccess(mensagem) {
    log(`✅ ${mensagem}`, 'green');
}

function logWarning(mensagem) {
    log(`⚠️  ${mensagem}`, 'yellow');
}

function logError(mensagem) {
    log(`❌ ${mensagem}`, 'red');
}

function gerarJwtSecret() {
    return crypto.randomBytes(32).toString('hex');
}

function gerarSenhaApp(tamanho = 16) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let senha = '';
    for (let i = 0; i < tamanho; i++) {
        senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return senha;
}

async function executarComando(comando, descricao) {
    try {
        log(`Executando: ${descricao}`, 'gray');
        execSync(comando, { stdio: 'inherit', shell: process.platform === 'win32' });
        return true;
    } catch (error) {
        logError(`Falha ao executar: ${descricao}`);
        return false;
    }
}

async function main() {
    log('\n╔════════════════════════════════════════════╗', 'blue');
    log('║   🚀 INICIALIZAÇÃO - FRCOMERCE            ║', 'blue');
    log('║   Setup Completo da API                    ║', 'blue');
    log('╚════════════════════════════════════════════╝\n', 'blue');

    try {
        // Step 1: Instalar dependências
        logStep('1', 'Instalando dependências do projeto');
        
        const apiPath = path.join(__dirname, 'api');
        const nodeModulesPath = path.join(apiPath, 'node_modules');
        
        if (!fs.existsSync(nodeModulesPath)) {
            logWarning('node_modules não encontrado. Instalando dependências...');
            if (executarComando(`cd "${apiPath}" && npm install`, 'npm install')) {
                logSuccess('Dependências instaladas com sucesso');
            } else {
                throw new Error('Falha ao instalar dependências');
            }
        } else {
            logSuccess('Dependências já estão instaladas');
        }

        // Step 2: Criar arquivo .env
        logStep('2', 'Configurando variáveis de ambiente (.env)');
        
        const envPath = path.join(apiPath, '.env');
        
        if (!fs.existsSync(envPath)) {
            const jwtSecret = gerarJwtSecret();
            const senhaAppSugestao = gerarSenhaApp();
            
            const envContent = `# ============================================
# CONFIGURAÇÃO DO BANCO DE DADOS
# ============================================

# Opção 1: Connection String completa
# DATABASE_URL=postgresql://usuario:senha@localhost:5432/frcomerce

# Opção 2: Variáveis individuais (padrão)
DB_USER=postgres
DB_PASSWORD=sua_senha_postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=frcomerce

# ============================================
# CONFIGURAÇÃO DA API
# ============================================
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000

# ============================================
# SEGURANÇA (JWT Secret gerado automaticamente)
# ============================================
JWT_SECRET=${jwtSecret}

# ============================================
# CONFIGURAÇÃO DE EMAIL
# ============================================
# Gmail com App Password (recomendado):
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=${senhaAppSugestao}
SMTP_FROM=seu_email@gmail.com

# Para testes locais com Mailhog (descomente):
# SMTP_HOST=localhost
# SMTP_PORT=1025
# SMTP_USER=test@example.com
# SMTP_PASS=test

# Gerado em: ${new Date().toLocaleString('pt-BR')}
`;
            
            fs.writeFileSync(envPath, envContent);
            logSuccess(`.env criado com sucesso em: ${envPath}`);
            logWarning('Edite o arquivo .env com suas credenciais do PostgreSQL');
        } else {
            logSuccess(`.env já existe em: ${envPath}`);
        }

        // Step 3: Criar .env.example se não existir
        logStep('3', 'Criando arquivo de referência .env.example');
        const envExamplePath = path.join(apiPath, '.env.example');
        if (!fs.existsSync(envExamplePath)) {
            fs.copyFileSync(envPath, envExamplePath);
            logSuccess('.env.example criado com sucesso');
        } else {
            logSuccess('.env.example já existe');
        }

        // Step 4: Informações sobre banco de dados
        logStep('4', 'Próximas etapas: Configurar banco de dados');
        
        log('\n📊 Você precisa fazer essas coisas manualmente:', 'blue');
        log('\n1️⃣  CRIAR BANCO DE DADOS PostgreSQL:', 'bright');
        log('   Abra PowerShell/CMD e execute:\n', 'gray');
        log('   createdb -U postgres frcomerce\n', 'yellow');
        
        log('2️⃣  CRIAR TABELAS:', 'bright');
        log('   Abra PowerShell/CMD e execute:\n', 'gray');
        log('   psql -U postgres -d frcomerce -f api/config/schema.sql\n', 'yellow');
        
        log('3️⃣  EDITAR CREDENCIAIS:', 'bright');
        log('   Abra o arquivo: api/.env', 'gray');
        log('   Edite as variáveis com suas credenciais:\n', 'gray');
        log('   - DB_PASSWORD: sua senha do PostgreSQL', 'yellow');
        log('   - SMTP_USER: seu email do Gmail (opcional)', 'yellow');
        log('   - SMTP_PASS: sua App Password do Gmail (opcional)\n', 'yellow');

        // Step 5: Informações finais
        logStep('5', 'Iniciando a API');
        
        log('\n✨ Setup quase completo!', 'bright');
        log('\nPara iniciar o servidor, execute um dos comandos:', 'blue');
        log('\n  npm run dev    (com hot reload)', 'yellow');
        log('  npm start      (produção)\n', 'yellow');
        
        log('A API estará disponível em: http://localhost:3000', 'bright');
        
        log('\n╔════════════════════════════════════════════╗', 'green');
        log('║  ✅ INICIALIZAÇÃO CONCLUÍDA COM SUCESSO!   ║', 'green');
        log('╚════════════════════════════════════════════╝\n', 'green');

    } catch (error) {
        log('\n╔════════════════════════════════════════════╗', 'red');
        log('║  ❌ ERRO DURANTE INICIALIZAÇÃO            ║', 'red');
        log('╚════════════════════════════════════════════╝\n', 'red');
        
        logError(`${error.message}`);
        log('\nDicas de troubleshooting:', 'yellow');
        log('1. Certifique-se de que Node.js está instalado: node --version', 'gray');
        log('2. Certifique-se de que PostgreSQL está instalado: psql --version', 'gray');
        log('3. Verifique se npm install rodou corretamente', 'gray');
        log('4. Tente deletar node_modules e rodar npm install novamente\n', 'gray');
        
        process.exit(1);
    }
}

// Executar
main().catch(err => {
    logError(err.message);
    process.exit(1);
});


async function main() {
    log('\n╔═══════════════════════════════════════╗', 'blue');
    log('║  🚀 Inicialização - FRcomerce        ║', 'blue');
    log('╚═══════════════════════════════════════╝\n', 'blue');

    try {
        // Step 1: Instalar dependências
        logStep('1', 'Instalando dependências');
        log('Isso pode levar alguns momentos...', 'yellow');
        
        if (!fs.existsSync(path.join(process.cwd(), 'api', 'node_modules'))) {
            execSync('cd api && npm install', { stdio: 'inherit' });
            log('✅ Dependências instaladas', 'green');
        } else {
            log('✓ Dependências já instaladas', 'green');
        }

        // Step 2: Gerar .env
        logStep('2', 'Gerando arquivo .env');
        
        const envPath = path.join(process.cwd(), 'api', '.env');
        
        if (!fs.existsSync(envPath)) {
            const jwtSecret = gerarJwtSecret();
            const senhaApp = gerarSenhaApp();
            
            const envContent = `# Variáveis de Ambiente - FRcomerce API
# Gerado automaticamente em ${new Date().toLocaleString('pt-BR')}

## Banco de Dados PostgreSQL
# URL de conexão completa (substitua com suas credenciais)
DATABASE_URL=postgresql://postgres:sua_senha@localhost:5432/frcomerce

## JWT Secret (gerado automaticamente)
JWT_SECRET=${jwtSecret}

## URL do Frontend
FRONTEND_URL=http://localhost:3000

## Configuração de Email (para recuperação de senha)
## Opção 1: Gmail (mude SMTP_USER)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=${senhaApp}

## Opção 2: Para testes locais com Mailhog
## Descomente abaixo e comente o Gmail acima
## SMTP_HOST=localhost
## SMTP_PORT=1025
## SMTP_USER=test@example.com
## SMTP_PASS=teste

## Ambiente
NODE_ENV=development

## Porta
PORT=3000
`;
            
            fs.writeFileSync(envPath, envContent);
            log(`✅ Arquivo .env criado`, 'green');
            log(`   DATABASE_URL: postgresql://postgres:***@localhost:5432/frcomerce`, 'gray');
            log(`   JWT_SECRET: ${jwtSecret.substring(0, 10)}...`, 'gray');
            log(`   SMTP_PASS: ${senhaApp}`, 'gray');
            log(`\n⚠️  IMPORTANTE: Edite api/.env e configure:`, 'yellow');
            log(`   - DATABASE_URL (sua connection string PostgreSQL)`, 'yellow');
            log(`   - SMTP_USER (seu email Gmail ou remova para usar Mailhog)`, 'yellow');
        } else {
            log('✓ Arquivo .env já existe', 'green');
        }

        // Step 3: Verificar banco de dados
        logStep('3', 'Preparando banco de dados');
        log('⚠️  Verifique se PostgreSQL está rodando', 'yellow');
        log('Execute manualmente:', 'gray');
        log('  createdb frcomerce', 'gray');
        log('  psql -U postgres -d frcomerce -f api/config/schema.sql', 'gray');

        // Step 4: Resumo final
        logStep('4', 'Resumo e Próximos Passos');
        
        log('\n✅ Setup concluído!', 'green');
        
        log('\n📝 Checklist de configuração:', 'bright');
        log('  ☐ Editar api/.env (credenciais do banco)', 'yellow');
        log('  ☐ Criar banco: createdb frcomerce', 'yellow');
        log('  ☐ Executar schema: psql -U postgres -d frcomerce -f api/config/schema.sql', 'yellow');
        log('  ☐ Verificar se PostgreSQL está rodando', 'yellow');
        
        log('\n🚀 Iniciar desenvolvimento:', 'bright');
        log('  cd api', 'blue');
        log('  npm run dev', 'blue');
        
        log('\n📧 Opções de Email:', 'bright');
        log('  Gmail: Configure SMTP_USER e SMTP_PASS no .env', 'gray');
        log('  Mailhog (testes): docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog', 'gray');
        log('                   Depois acesse http://localhost:8025', 'gray');
        
        log('\n📚 Documentação:', 'bright');
        log('  - SETUP_AUTOMATIZADO.md (este processo)', 'gray');
        log('  - API_README.md (documentação da API)', 'gray');
        log('  - RECUPERAR_SENHA_GUIA.md (recuperação de senha)', 'gray');
        log('  - INTEGRACAO_GUIA.md (integração frontend)', 'gray');
        
        log('\n✨ Seu projeto está pronto para desenvolvimento!\n', 'green');

    } catch (error) {
        log(`\n❌ Erro durante a inicialização:`, 'red');
        log(`${error.message}\n`, 'red');
        process.exit(1);
    }
}

main();
