import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { User } from '../models/models.js';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_secret_super_seguro_aqui_mude_em_producao';

export async function register(req, res) {
  try {
    const { nome, email, senha, telefone } = req.body;

    // Validações
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ erro: 'Email inválido' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ erro: 'Senha deve ter pelo menos 6 caracteres' });
    }

    // Verificar se email já existe
    const usuarioExistente = await User.findByEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({ erro: 'Email já cadastrado' });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    const usuario = await User.create({
      nome,
      email,
      senha: senhaHash,
      telefone: telefone || null,
    });

    // Criar token JWT
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(201).json({
      mensagem: 'Usuário criado com sucesso',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
      token,
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ erro: 'Erro ao criar conta' });
  }
}

export async function login(req, res) {
  try {
    const { email, senha } = req.body;

    // Validações
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const usuario = await User.findByEmail(email);
    if (!usuario) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }

    // Comparar senhas
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }

    // Criar token JWT
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
      token,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ erro: 'Erro ao fazer login' });
  }
}

export async function me(req, res) {
  try {
    const usuario = await User.findById(req.userId);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ erro: 'Erro ao buscar usuário' });
  }
}

export async function updateProfile(req, res) {
  try {
    const { nome, telefone } = req.body;

    const usuario = await User.update(req.userId, { nome, telefone });

    return res.status(200).json({
      mensagem: 'Perfil atualizado com sucesso',
      usuario,
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar perfil' });
  }
}
