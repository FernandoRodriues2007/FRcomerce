import crypto from 'crypto';
import pool from '../config/database.js';
import nodemailer from 'nodemailer';
import { User } from '../models/models.js';

// Configurar nodemailer para enviar emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'seu-email@gmail.com',
    pass: process.env.SMTP_PASS || 'sua-senha-app',
  },
});

export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ erro: 'Email é obrigatório' });
    }

    // Verificar se usuário existe
    const usuario = await User.findByEmail(email);
    if (!usuario) {
      // Não revelar se o email existe ou não (segurança)
      return res.status(200).json({
        mensagem: 'Se o email está registrado, você receberá um link para resetar a senha',
      });
    }

    // Gerar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

    // Salvar token no banco
    await pool.query(
      `UPDATE usuarios 
       SET reset_token = $1, reset_token_expire = $2 
       WHERE id = $3`,
      [resetTokenHash, resetTokenExpire, usuario.id]
    );

    // URL para resetar senha
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/resetarSenha.html?token=${resetToken}`;

    // Enviar email
    const mailOptions = {
      from: process.env.SMTP_USER || 'seu-email@gmail.com',
      to: email,
      subject: 'Recuperação de Senha - FRcomerce',
      html: `
        <h2>Olá ${usuario.nome}!</h2>
        <p>Você solicitou a recuperação de senha. Clique no link abaixo para resetar sua senha:</p>
        <p><a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Resetar Senha</a></p>
        <p>Ou copie este link: ${resetUrl}</p>
        <p>Este link expira em 30 minutos.</p>
        <p>Se você não solicitou esta recuperação, ignore este email.</p>
        <p>Atenciosamente,<br>FRcomerce</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      // Ainda retornar sucesso para não revelar informações
    }

    return res.status(200).json({
      mensagem: 'Se o email está registrado, você receberá um link para resetar a senha',
    });
  } catch (error) {
    console.error('Erro ao solicitar reset de senha:', error);
    return res.status(500).json({ erro: 'Erro ao processar solicitação' });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, novaSenha, confirmaSenha } = req.body;

    if (!token || !novaSenha || !confirmaSenha) {
      return res.status(400).json({ erro: 'Token e senhas são obrigatórios' });
    }

    if (novaSenha !== confirmaSenha) {
      return res.status(400).json({ erro: 'As senhas não conferem' });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres' });
    }

    // Hash do token
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Buscar usuário com token válido
    const result = await pool.query(
      `SELECT id FROM usuarios 
       WHERE reset_token = $1 AND reset_token_expire > NOW()`,
      [resetTokenHash]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ erro: 'Token inválido ou expirado' });
    }

    const usuarioId = result.rows[0].id;

    // Hash da nova senha
    const bcrypt = await import('bcryptjs');
    const senhaHash = await bcrypt.default.hash(novaSenha, 10);

    // Atualizar senha e limpar token
    await pool.query(
      `UPDATE usuarios 
       SET senha = $1, reset_token = NULL, reset_token_expire = NULL 
       WHERE id = $2`,
      [senhaHash, usuarioId]
    );

    return res.status(200).json({
      mensagem: 'Senha resetada com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    return res.status(500).json({ erro: 'Erro ao resetar senha' });
  }
}

export async function verifyResetToken(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ valido: false, erro: 'Token não fornecido' });
    }

    // Hash do token
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Verificar se token é válido
    const result = await pool.query(
      `SELECT id FROM usuarios 
       WHERE reset_token = $1 AND reset_token_expire > NOW()`,
      [resetTokenHash]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ valido: false, erro: 'Token inválido ou expirado' });
    }

    return res.status(200).json({ valido: true });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(500).json({ valido: false, erro: 'Erro ao verificar token' });
  }
}
