import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export class User {
  static async create(userData) {
    const id = uuidv4();
    const { nome, email, senha, telefone } = userData;
    const criado_em = new Date();

    try {
      const result = await pool.query(
        `INSERT INTO usuarios (id, nome, email, senha, telefone, criado_em) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id, nome, email, telefone, criado_em`,
        [id, nome, email, senha, telefone, criado_em]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  static async findByEmail(email) {
    try {
      const result = await pool.query(
        'SELECT * FROM usuarios WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT id, nome, email, telefone, criado_em FROM usuarios WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  static async update(id, userData) {
    const { nome, telefone } = userData;
    const atualizado_em = new Date();

    try {
      const result = await pool.query(
        `UPDATE usuarios SET nome = $1, telefone = $2, atualizado_em = $3 
         WHERE id = $4 
         RETURNING id, nome, email, telefone, atualizado_em`,
        [nome, telefone, atualizado_em, id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }
}

export class Product {
  static async create(productData) {
    const id = uuidv4();
    const { nome, descricao, preco, categoria, estoque, imagem } = productData;
    const criado_em = new Date();

    try {
      const result = await pool.query(
        `INSERT INTO produtos (id, nome, descricao, preco, categoria, estoque, imagem, criado_em) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING *`,
        [id, nome, descricao, preco, categoria, estoque, imagem, criado_em]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao criar produto: ${error.message}`);
    }
  }

  static async findAll(limite = 50, pagina = 1) {
    const offset = (pagina - 1) * limite;
    try {
      const result = await pool.query(
        'SELECT * FROM produtos ORDER BY criado_em DESC LIMIT $1 OFFSET $2',
        [limite, offset]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao buscar produtos: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM produtos WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao buscar produto: ${error.message}`);
    }
  }

  static async findByCategory(categoria) {
    try {
      const result = await pool.query(
        'SELECT * FROM produtos WHERE categoria = $1 ORDER BY criado_em DESC',
        [categoria]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao buscar produtos por categoria: ${error.message}`);
    }
  }

  static async update(id, productData) {
    const { nome, descricao, preco, categoria, estoque, imagem } = productData;
    const atualizado_em = new Date();

    try {
      const result = await pool.query(
        `UPDATE produtos 
         SET nome = $1, descricao = $2, preco = $3, categoria = $4, estoque = $5, imagem = $6, atualizado_em = $7
         WHERE id = $8 
         RETURNING *`,
        [nome, descricao, preco, categoria, estoque, imagem, atualizado_em, id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao atualizar produto: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      await pool.query('DELETE FROM produtos WHERE id = $1', [id]);
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar produto: ${error.message}`);
    }
  }
}

export class Order {
  static async create(orderData) {
    const id = uuidv4();
    const { usuario_id, total, status } = orderData;
    const criado_em = new Date();

    try {
      const result = await pool.query(
        `INSERT INTO pedidos (id, usuario_id, total, status, criado_em) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [id, usuario_id, total, status, criado_em]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao criar pedido: ${error.message}`);
    }
  }

  static async findByUserId(usuario_id) {
    try {
      const result = await pool.query(
        'SELECT * FROM pedidos WHERE usuario_id = $1 ORDER BY criado_em DESC',
        [usuario_id]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao buscar pedidos: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM pedidos WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao buscar pedido: ${error.message}`);
    }
  }

  static async updateStatus(id, status) {
    const atualizado_em = new Date();
    try {
      const result = await pool.query(
        'UPDATE pedidos SET status = $1, atualizado_em = $2 WHERE id = $3 RETURNING *',
        [status, atualizado_em, id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao atualizar pedido: ${error.message}`);
    }
  }
}
