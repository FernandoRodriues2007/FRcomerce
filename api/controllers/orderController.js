import { Order } from '../models/models.js';

export async function createOrder(req, res) {
  try {
    const { itens, total } = req.body;
    const usuario_id = req.userId;

    if (!itens || itens.length === 0 || !total) {
      return res.status(400).json({ erro: 'Dados do pedido incompletos' });
    }

    const pedido = await Order.create({
      usuario_id,
      total: parseFloat(total),
      status: 'pendente',
    });

    return res.status(201).json({
      mensagem: 'Pedido criado com sucesso',
      pedido,
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return res.status(500).json({ erro: 'Erro ao criar pedido' });
  }
}

export async function getMyOrders(req, res) {
  try {
    const usuario_id = req.userId;

    const pedidos = await Order.findByUserId(usuario_id);

    return res.status(200).json({
      pedidos,
      total: pedidos.length,
    });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return res.status(500).json({ erro: 'Erro ao buscar pedidos' });
  }
}

export async function getOrderById(req, res) {
  try {
    const { id } = req.params;

    const pedido = await Order.findById(id);
    if (!pedido) {
      return res.status(404).json({ erro: 'Pedido não encontrado' });
    }

    // Verificar se o pedido pertence ao usuário autenticado
    if (pedido.usuario_id !== req.userId) {
      return res.status(403).json({ erro: 'Acesso negado' });
    }

    return res.status(200).json(pedido);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return res.status(500).json({ erro: 'Erro ao buscar pedido' });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ erro: 'Status é obrigatório' });
    }

    const pedido = await Order.findById(id);
    if (!pedido) {
      return res.status(404).json({ erro: 'Pedido não encontrado' });
    }

    const statusValidos = ['pendente', 'processando', 'enviado', 'entregue', 'cancelado'];
    if (!statusValidos.includes(status)) {
      return res.status(400).json({ erro: 'Status inválido' });
    }

    const pedidoAtualizado = await Order.updateStatus(id, status);

    return res.status(200).json({
      mensagem: 'Pedido atualizado com sucesso',
      pedido: pedidoAtualizado,
    });
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar pedido' });
  }
}
