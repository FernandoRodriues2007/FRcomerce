/**
 * Arquivo de autenticação e gerenciamento de tokens
 * Use este arquivo em todas as páginas que precisam de autenticação
 */

// Configuração da API
const API_URL = 'http://localhost:3000/api';

/**
 * Obter token do localStorage
 */
function getToken() {
    return localStorage.getItem('token');
}

/**
 * Obter dados do usuário logado
 */
function getUsuario() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
}

/**
 * Verificar se usuário está logado
 */
function isLoggedIn() {
    return getToken() !== null;
}

/**
 * Logout - remover dados do localStorage
 */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = 'index.html';
}

/**
 * Proteger página - redirecionar para login se não autenticado
 */
function protegerPagina() {
    if (!isLoggedIn()) {
        alert('Você precisa fazer login para acessar esta página.');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

/**
 * Fazer requisição autenticada à API
 */
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (response.status === 401) {
            // Token expirado ou inválido
            logout();
            return null;
        }

        if (!response.ok) {
            throw new Error(data.erro || 'Erro na requisição');
        }

        return data;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

/**
 * Obter dados do perfil do usuário
 */
async function getProfile() {
    return apiRequest('/usuario/me', { method: 'GET' });
}

/**
 * Atualizar perfil do usuário
 */
async function updateProfile(nome, telefone) {
    return apiRequest('/usuario/perfil', {
        method: 'PUT',
        body: JSON.stringify({ nome, telefone }),
    });
}

/**
 * Listar produtos
 */
async function getProducts(pagina = 1, limite = 50, categoria = null) {
    let url = `/produtos?pagina=${pagina}&limite=${limite}`;
    if (categoria) {
        url += `&categoria=${categoria}`;
    }
    return apiRequest(url, { method: 'GET' });
}

/**
 * Obter detalhes de um produto
 */
async function getProductById(id) {
    return apiRequest(`/produtos/${id}`, { method: 'GET' });
}

/**
 * Listar meus pedidos
 */
async function getMyOrders() {
    return apiRequest('/pedidos', { method: 'GET' });
}

/**
 * Obter detalhes de um pedido
 */
async function getOrderById(id) {
    return apiRequest(`/pedidos/${id}`, { method: 'GET' });
}

/**
 * Criar um novo pedido
 */
async function createOrder(itens, total) {
    return apiRequest('/pedidos', {
        method: 'POST',
        body: JSON.stringify({ itens, total }),
    });
}

/**
 * Atualizar status de um pedido
 */
async function updateOrderStatus(id, status) {
    return apiRequest(`/pedidos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
}

/**
 * Exibir dados do usuário na página
 */
function displayUserInfo() {
    const usuario = getUsuario();
    if (!usuario) return;

    // Você pode usar isto em qualquer página para exibir o nome do usuário
    const userNameElements = document.querySelectorAll('[data-user-name]');
    userNameElements.forEach(el => {
        el.textContent = usuario.nome;
    });

    const userEmailElements = document.querySelectorAll('[data-user-email]');
    userEmailElements.forEach(el => {
        el.textContent = usuario.email;
    });
}

// Executar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    displayUserInfo();
});
