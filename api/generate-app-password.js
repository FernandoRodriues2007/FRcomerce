#!/usr/bin/env node

/**
 * Gerador de Senha de App (16 caracteres)
 * Para uso com Gmail ou outros serviços
 * 
 * Uso: node generate-app-password.js
 * ou: npm run generate:password
 */

import crypto from 'crypto';

// Cores para terminal
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    gray: '\x1b[90m',
};

/**
 * Gerar senha segura de N caracteres
 */
function gerarSenhaSegura(tamanho = 16) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let senha = '';
    
    for (let i = 0; i < tamanho; i++) {
        const indice = crypto.randomInt(0, caracteres.length);
        senha += caracteres[indice];
    }
    
    return senha;
}

/**
 * Gerar múltiplas opções de senha
 */
function gerarMultiplasSenhas(quantidade = 5, tamanho = 16) {
    const senhas = [];
    for (let i = 0; i < quantidade; i++) {
        senhas.push(gerarSenhaSegura(tamanho));
    }
    return senhas;
}

/**
 * Exibir resultado formatado
 */
function exibir(titulo, senhas) {
    console.log(`\n${colors.bright}${colors.blue}${titulo}${colors.reset}\n`);
    
    senhas.forEach((senha, indice) => {
        console.log(`  ${colors.green}${indice + 1}.${colors.reset} ${colors.bright}${senha}${colors.reset}`);
    });
    
    console.log(`\n${colors.yellow}💡 Copie uma das senhas acima para usar em .env${colors.reset}\n`);
}

// Executar
const quantidade = process.argv[2] ? parseInt(process.argv[2]) : 5;
const tamanho = process.argv[3] ? parseInt(process.argv[3]) : 16;

console.log(`${colors.bright}${colors.blue}🔐 Gerador de Senha de App (Google/Email)${colors.reset}`);
console.log(`${colors.gray}Tamanho: ${tamanho} caracteres | Quantidade: ${quantidade}${colors.reset}`);

const senhas = gerarMultiplasSenhas(quantidade, tamanho);
exibir('Senhas Geradas:', senhas);

// Copiar primeira para clipboard (opcional, depende do SO)
if (process.argv.includes('--copy')) {
    try {
        const clipboardy = await import('clipboardy');
        await clipboardy.default.write(senhas[0]);
        console.log(`${colors.green}✅ Primeira senha copiada para clipboard!${colors.reset}\n`);
    } catch (error) {
        console.log(`${colors.yellow}ℹ️  Para copiar automaticamente, instale: npm install clipboardy${colors.reset}\n`);
    }
}

console.log(`${colors.bright}Como usar:${colors.reset}`);
console.log(`  1. Copie uma das senhas acima`);
console.log(`  2. Abra seu arquivo .env`);
console.log(`  3. Cole em SMTP_PASS=\n`);
console.log(`${colors.gray}Exemplo: SMTP_PASS=${senhas[0]}${colors.reset}\n`);
