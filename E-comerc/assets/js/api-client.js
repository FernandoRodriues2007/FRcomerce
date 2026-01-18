/**
 * Cliente HTTP para fazer requisições à API do FRcomerce
 * Use este arquivo no seu frontend para comunicar com a API
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class APIClient {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  /**
   * Função para fazer requisições genéricas
   */
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }

  // ===== AUTENTICAÇÃO =====
  async registrar(nome, email, senha, telefone = '') {
    return this.request('/auth/registrar', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha, telefone }),
    });
  }

  async login(email, senha) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem('token', response.token);
    }

    return response;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // ===== USUÁRIO =====
  async getProfile() {
    return this.request('/usuario/me', { method: 'GET' });
  }

  async updateProfile(nome, telefone) {
    return this.request('/usuario/perfil', {
      method: 'PUT',
      body: JSON.stringify({ nome, telefone }),
    });
  }

  // ===== PRODUTOS =====
  async getProducts(pagina = 1, limite = 50, categoria = null) {
    let url = `/produtos?pagina=${pagina}&limite=${limite}`;
    if (categoria) {
      url += `&categoria=${categoria}`;
    }
    return this.request(url, { method: 'GET' });
  }

  async getProductById(id) {
    return this.request(`/produtos/${id}`, { method: 'GET' });
  }

  async createProduct(nome, descricao, preco, categoria, estoque, imagem = null) {
    return this.request('/produtos', {
      method: 'POST',
      body: JSON.stringify({
        nome,
        descricao,
        preco,
        categoria,
        estoque,
        imagem,
      }),
    });
  }

  async updateProduct(id, nome, descricao, preco, categoria, estoque, imagem = null) {
    return this.request(`/produtos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        nome,
        descricao,
        preco,
        categoria,
        estoque,
        imagem,
      }),
    });
  }

  async deleteProduct(id) {
    return this.request(`/produtos/${id}`, { method: 'DELETE' });
  }

  // ===== PEDIDOS =====
  async createOrder(itens, total) {
    return this.request('/pedidos', {
      method: 'POST',
      body: JSON.stringify({ itens, total }),
    });
  }

  async getMyOrders() {
    return this.request('/pedidos', { method: 'GET' });
  }

  async getOrderById(id) {
    return this.request(`/pedidos/${id}`, { method: 'GET' });
  }

  async updateOrderStatus(id, status) {
    return this.request(`/pedidos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
}

// Exportar instância única
const api = new APIClient();

// Para usar em HTML/JS puro:
// api.getProducts().then(data => console.log(data))
// api.login('email@example.com', 'senha').then(user => console.log(user))

export default api;
