#!/usr/bin/env node

/**
 * Script para gerar configurações de ambiente automaticamente
 * Gera senhas aleatórias e cria arquivo .env
 * 
 * Uso: node generate-env.js
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Cores para terminal
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
};

/**
 * Gerar string aleatória de X caracteres
 */
function gerarStringAleatoria(tamanho = 32) {
    return crypto.randomBytes(tamanho).toString('hex').substring(0, tamanho);
}

/**
 * Gerar senha de 16 caracteres (para compatibilidade com Google App Password)
 */
function gerarSenhaApp(tamanho = 16) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let senha = '';
    for (let i = 0; i < tamanho; i++) {
        senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return senha;
}

/**
 * Gerar JWT Secret seguro
 */
function gerarJwtSecret() {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Ler entrada do usuário
 */
function lerEntrada(pergunta) {
    return new Promise((resolve) => {
        process.stdout.write(pergunta);
        process.stdin.once('data', (data) => {
            resolve(data.toString().trim());
        });
    });
}

/**
 * Função principal
 */
async function main() {
    console.log(`${colors.bright}${colors.blue}🔧 Gerador de Configuração - FRcomerce API${colors.reset}\n`);

    // Verificar se .env já existe
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        console.log(`${colors.yellow}⚠️  Arquivo .env já existe!${colors.reset}\n`);
        const opcao = await lerEntrada('Deseja sobrescrever? (s/n): ');
        if (opcao.toLowerCase() !== 's') {
            console.log(`${colors.red}❌ Operação cancelada${colors.reset}`);
            process.exit(0);
        }
    }

    console.log(`${colors.blue}📝 Configure as variáveis de ambiente:${colors.reset}\n`);

    // Banco de Dados
    console.log(`${colors.bright}Database${colors.reset}`);
    const dbHost = await lerEntrada('  DB_HOST (localhost): ') || 'localhost';
    const dbPort = await lerEntrada('  DB_PORT (5432): ') || '5432';
    const dbUser = await lerEntrada('  DB_USER (postgres): ') || 'postgres';
    const dbPassword = await lerEntrada('  DB_PASSWORD: ');
    const dbName = await lerEntrada('  DB_NAME (frcomerce): ') || 'frcomerce';

    console.log();

    // JWT
    console.log(`${colors.bright}Segurança${colors.reset}`);
    const jwtSecret = gerarJwtSecret();
    console.log(`  ${colors.green}✓ JWT_SECRET gerado automaticamente${colors.reset}`);

    console.log();

    // Email
    console.log(`${colors.bright}Email (Recuperação de Senha)${colors.reset}`);
    const emailOpcao = await lerEntrada('  Usar Gmail? (s/n): ');

    let smtpConfig = '';
    if (emailOpcao.toLowerCase() === 's') {
        const smtpUser = await lerEntrada('  SMTP_USER (seu-email@gmail.com): ');
        const smtpPass = await lerEntrada('  SMTP_PASS (senha de app): ');
        
        if (!smtpPass) {
            const senhaGerada = gerarSenhaApp();
            console.log(`  ${colors.yellow}⚠️  Nenhuma senha fornecida. Gerando uma para teste:${colors.reset}`);
            console.log(`  ${colors.green}Senha gerada: ${senhaGerada}${colors.reset}`);
            smtpConfig = `SMTP_HOST=smtp.gmail.com\nSMTP_PORT=587\nSMTP_USER=${smtpUser}\nSMTP_PASS=${senhaGerada}`;
        } else {
            smtpConfig = `SMTP_HOST=smtp.gmail.com\nSMTP_PORT=587\nSMTP_USER=${smtpUser}\nSMTP_PASS=${smtpPass}`;
        }
    } else {
        console.log(`  ${colors.blue}ℹ️  Usando Mailhog para testes (desenvolvimento)${colors.reset}`);
        smtpConfig = `SMTP_HOST=localhost\nSMTP_PORT=1025\nSMTP_USER=test@example.com\nSMTP_PASS=teste`;
    }

    console.log();

    // Frontend
    console.log(`${colors.bright}Frontend${colors.reset}`);
    const frontendUrl = await lerEntrada('  FRONTEND_URL (http://localhost:3000): ') || 'http://localhost:3000';

    console.log();

    // Ambiente
    console.log(`${colors.bright}Ambiente${colors.reset}`);
    const nodeEnv = await lerEntrada('  NODE_ENV (development): ') || 'development';
    const port = await lerEntrada('  PORT (3000): ') || '3000';

    // Gerar conteúdo do .env
    const envContent = `# Variáveis de Ambiente - FRcomerce API
# Gerado automaticamente em ${new Date().toLocaleString('pt-BR')}

## Banco de Dados PostgreSQL
DB_HOST=${dbHost}
DB_PORT=${dbPort}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
DB_NAME=${dbName}

## JWT Secret (mude isto em produção!)
JWT_SECRET=${jwtSecret}

## URL do Frontend
FRONTEND_URL=${frontendUrl}

## Configuração de Email (para recuperação de senha)
${smtpConfig}

## Ambiente
NODE_ENV=${nodeEnv}

## Porta (apenas para desenvolvimento local)
PORT=${port}
`;

    // Salvar arquivo
    try {
        fs.writeFileSync(envPath, envContent);
        console.log(`${colors.green}✅ Arquivo .env criado com sucesso!${colors.reset}\n`);

        console.log(`${colors.bright}📋 Resumo:${colors.reset}`);
        console.log(`  Database: ${dbUser}@${dbHost}:${dbPort}/${dbName}`);
        console.log(`  JWT Secret: ${jwtSecret.substring(0, 10)}...`);
        console.log(`  Email: ${emailOpcao.toLowerCase() === 's' ? 'Gmail' : 'Mailhog (testes)'}`);
        console.log(`  Frontend URL: ${frontendUrl}`);
        console.log(`  Node Env: ${nodeEnv}`);
        console.log(`  Port: ${port}\n`);

        if (emailOpcao.toLowerCase() !== 's') {
            console.log(`${colors.blue}ℹ️  Para usar Mailhog, instale e execute:${colors.reset}`);
            console.log(`  docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog\n`);
            console.log(`  Depois acesse http://localhost:8025 para ver emails\n`);
        }

        console.log(`${colors.bright}🚀 Próximos passos:${colors.reset}`);
        console.log(`  1. npm install`);
        console.log(`  2. npm run dev\n`);

        process.exit(0);
    } catch (error) {
        console.error(`${colors.red}❌ Erro ao criar arquivo .env:${colors.reset}`, error);
        process.exit(1);
    }
}

// Iniciar
main().catch((error) => {
    console.error(`${colors.red}❌ Erro:${colors.reset}`, error);
    process.exit(1);
});
