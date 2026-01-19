#!/usr/bin/env node

/**
 * Script de inicialização completa do projeto
 * Faz todo o setup em uma única execução
 * 
 * Uso: npm run init (na raiz do projeto)
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import crypto from 'crypto';

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
    log('─'.repeat(50), 'gray');
}

function gerarJwtSecret() {
    return crypto.randomBytes(32).toString('hex');
}

function gerarSenhaApp() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let senha = '';
    for (let i = 0; i < 16; i++) {
        senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return senha;
}

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
