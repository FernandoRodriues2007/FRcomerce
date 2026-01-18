import { Product } from '../models/models.js';

export async function getAllProducts(req, res) {
  try {
    const { pagina = 1, limite = 50, categoria } = req.query;

    let produtos;

    if (categoria) {
      produtos = await Product.findByCategory(categoria);
    } else {
      produtos = await Product.findAll(parseInt(limite), parseInt(pagina));
    }

    return res.status(200).json({
      produtos,
      total: produtos.length,
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return res.status(500).json({ erro: 'Erro ao buscar produtos' });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const produto = await Product.findById(id);
    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    return res.status(200).json(produto);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return res.status(500).json({ erro: 'Erro ao buscar produto' });
  }
}

export async function createProduct(req, res) {
  try {
    const { nome, descricao, preco, categoria, estoque, imagem } = req.body;

    if (!nome || !descricao || !preco || !categoria || estoque === undefined) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    const produto = await Product.create({
      nome,
      descricao,
      preco: parseFloat(preco),
      categoria,
      estoque: parseInt(estoque),
      imagem: imagem || null,
    });

    return res.status(201).json({
      mensagem: 'Produto criado com sucesso',
      produto,
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return res.status(500).json({ erro: 'Erro ao criar produto' });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, categoria, estoque, imagem } = req.body;

    const produtoExistente = await Product.findById(id);
    if (!produtoExistente) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    const produto = await Product.update(id, {
      nome: nome || produtoExistente.nome,
      descricao: descricao || produtoExistente.descricao,
      preco: preco ? parseFloat(preco) : produtoExistente.preco,
      categoria: categoria || produtoExistente.categoria,
      estoque: estoque !== undefined ? parseInt(estoque) : produtoExistente.estoque,
      imagem: imagem || produtoExistente.imagem,
    });

    return res.status(200).json({
      mensagem: 'Produto atualizado com sucesso',
      produto,
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const produtoExistente = await Product.findById(id);
    if (!produtoExistente) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    await Product.delete(id);

    return res.status(200).json({
      mensagem: 'Produto deletado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return res.status(500).json({ erro: 'Erro ao deletar produto' });
  }
}
