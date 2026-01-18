/**
 * Script para a página principal - carrega produtos e gerencia pedidos
 * Use este arquivo em principal.html ou páginas de produtos
 */

// Proteção da página
if (!protegerPagina()) {
    // Será redirecionado para login
}

/**
 * Carregar e exibir produtos
 */
async function carregarProdutos(categoria = null, pagina = 1) {
    try {
        const { produtos } = await getProducts(pagina, 50, categoria);
        
        const container = document.getElementById('produtos-container');
        if (!container) {
            console.warn('Elemento #produtos-container não encontrado');
            return;
        }
        
        if (produtos.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500">Nenhum produto encontrado</p>';
            return;
        }

        container.innerHTML = produtos.map(produto => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                ${produto.imagem ? `<img src="${produto.imagem}" alt="${produto.nome}" class="w-full h-48 object-cover">` : '<div class="w-full h-48 bg-gray-200 flex items-center justify-center"><span class="text-gray-400">Sem imagem</span></div>'}
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2">${produto.nome}</h3>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">${produto.descricao}</p>
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-blue-600 font-bold text-lg">R$ ${parseFloat(produto.preco).toFixed(2)}</span>
                        <span class="text-xs bg-gray-100 px-2 py-1 rounded">${produto.categoria}</span>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="adicionarAoCarrinho('${produto.id}', '${produto.nome}', ${produto.preco})" 
                                class="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                            Adicionar ao Carrinho
                        </button>
                        <button onclick="verDetalhes('${produto.id}')" 
                                class="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition">
                            Ver Detalhes
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Erro ao carregar produtos');
    }
}

/**
 * Obter carrinho do localStorage
 */
function getCarrinho() {
    const carrinho = localStorage.getItem('carrinho');
    return carrinho ? JSON.parse(carrinho) : [];
}

/**
 * Salvar carrinho no localStorage
 */
function salvarCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarBadgeCarrinho();
}

/**
 * Adicionar item ao carrinho
 */
function adicionarAoCarrinho(id, nome, preco, quantidade = 1) {
    const carrinho = getCarrinho();
    
    const itemExistente = carrinho.find(item => item.id === id);
    
    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({ id, nome, preco, quantidade });
    }
    
    salvarCarrinho(carrinho);
    alert(`${nome} adicionado ao carrinho!`);
}

/**
 * Remover item do carrinho
 */
function removerDoCarrinho(id) {
    let carrinho = getCarrinho();
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho(carrinho);
}

/**
 * Atualizar quantidade de item
 */
function atualizarQuantidadeCarrinho(id, quantidade) {
    const carrinho = getCarrinho();
    const item = carrinho.find(item => item.id === id);
    
    if (item) {
        if (quantidade <= 0) {
            removerDoCarrinho(id);
        } else {
            item.quantidade = quantidade;
            salvarCarrinho(carrinho);
        }
    }
}

/**
 * Atualizar badge do carrinho
 */
function atualizarBadgeCarrinho() {
    const carrinho = getCarrinho();
    const total = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    
    const badge = document.getElementById('carrinho-badge');
    if (badge) {
        badge.textContent = total;
        badge.style.display = total > 0 ? 'block' : 'none';
    }
}

/**
 * Calcular total do carrinho
 */
function calcularTotalCarrinho() {
    const carrinho = getCarrinho();
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

/**
 * Exibir detalhes de um produto
 */
async function verDetalhes(id) {
    try {
        const produto = await getProductById(id);
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
        
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-auto">
                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 float-right text-2xl">&times;</button>
                
                <div class="grid grid-cols-2 gap-6 mt-4">
                    <div>
                        ${produto.imagem ? `<img src="${produto.imagem}" alt="${produto.nome}" class="w-full rounded">` : '<div class="w-full h-64 bg-gray-200 rounded flex items-center justify-center"><span class="text-gray-400">Sem imagem</span></div>'}
                    </div>
                    
                    <div>
                        <h2 class="text-3xl font-bold mb-2">${produto.nome}</h2>
                        <p class="text-gray-600 mb-4">${produto.descricao}</p>
                        
                        <div class="mb-4">
                            <span class="text-4xl font-bold text-blue-600">R$ ${parseFloat(produto.preco).toFixed(2)}</span>
                        </div>
                        
                        <div class="mb-4">
                            <span class="inline-block bg-gray-100 px-3 py-1 rounded text-sm">${produto.categoria}</span>
                            <span class="inline-block ml-2 px-3 py-1 rounded text-sm ${produto.estoque > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                ${produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Fora de estoque'}
                            </span>
                        </div>
                        
                        <div class="flex gap-2">
                            <input type="number" id="quantidade-detalhes" min="1" value="1" max="${produto.estoque}" class="border rounded px-3 py-2 w-20">
                            <button onclick="adicionarAoCarrinho('${produto.id}', '${produto.nome}', ${produto.preco}, parseInt(document.getElementById('quantidade-detalhes').value)); this.closest('.fixed').remove();"
                                    class="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" ${produto.estoque <= 0 ? 'disabled' : ''}>
                                Adicionar ao Carrinho
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    } catch (error) {
        console.error('Erro ao obter detalhes:', error);
        alert('Erro ao obter detalhes do produto');
    }
}

/**
 * Finalizar compra
 */
async function finalizarCompra() {
    const carrinho = getCarrinho();
    
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio');
        return;
    }
    
    const total = calcularTotalCarrinho();
    
    if (!confirm(`Total: R$ ${total.toFixed(2)}. Deseja continuar?`)) {
        return;
    }
    
    try {
        const { pedido } = await createOrder(carrinho, total);
        alert('Pedido criado com sucesso! Número: ' + pedido.id);
        localStorage.removeItem('carrinho');
        window.location.href = 'pedidos.html';
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        alert('Erro ao criar pedido');
    }
}

/**
 * Filtrar por categoria
 */
function filtrarPorCategoria(categoria) {
    carregarProdutos(categoria);
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    atualizarBadgeCarrinho();
    // Carregar todos os produtos
    carregarProdutos();
});
