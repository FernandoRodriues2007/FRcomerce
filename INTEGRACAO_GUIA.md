# 🔗 Guia de Integração Frontend-Backend

## 📝 Resumo das Alterações

O frontend foi conectado ao backend da API Express + PostgreSQL. Aqui estão os arquivos modificados e as novas funcionalidades:

---

## ✅ O que foi Atualizado

### 1. **criarconta.html**
- ID do campo nome mudou de `name` para `nome`
- ID do campo senha permanece `senha`
- Botão agora chama `criarConta(event)` em vez de `criarConta()`

### 2. **criarconta.js** 
- Substitui localStorage local por chamada API `/auth/registrar`
- Valida campos básicos (email, senha mínimo 6 caracteres)
- Armazena token JWT no localStorage após sucesso
- Redireciona para `login.html` em caso de sucesso

### 3. **login.html**
- Botão agora chama `loginUser(event)` em vez de `login()`

### 4. **login.js**
- Substitui validação localStorage por chamada API `/auth/login`
- Faz autenticação real com o backend
- Armazena token JWT no localStorage
- Redireciona para `principal.html` após login bem-sucedido

### 5. **auth.js** (NOVO)
- Funções auxiliares para autenticação
- Gerenciamento de tokens
- Proteção de páginas
- Requisições autenticadas à API

---

## 🚀 Como Usar

### **No seu HTML**, adicione o script de autenticação:
```html
<script src="assets/js/auth.js"></script>
```

### **Proteger uma página** (requer login):
```javascript
// No topo da página, após carregar auth.js
if (!protegerPagina()) {
    // Usuário não autenticado, será redirecionado
}
```

### **Exibir nome do usuário logado**:
```html
<span data-user-name></span> <!-- Será preenchido automaticamente -->
<span data-user-email></span> <!-- Será preenchido automaticamente -->
```

### **Fazer logout**:
```html
<button onclick="logout()">Sair</button>
```

---

## 📡 Funções de API Disponíveis

Todas essas funções estão disponíveis em `auth.js`:

### Autenticação
```javascript
// Já integrado no formulário, mas você pode usar assim:
await apiRequest('/auth/registrar', {
    method: 'POST',
    body: JSON.stringify({ nome, email, senha })
});

await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha })
});
```

### Usuário
```javascript
// Obter dados do perfil
const perfil = await getProfile();

// Atualizar perfil
await updateProfile('Novo Nome', '123456789');
```

### Produtos
```javascript
// Listar produtos
const { produtos } = await getProducts(pagina = 1, limite = 50);

// Listar por categoria
const { produtos } = await getProducts(1, 50, 'eletrônicos');

// Detalhes de um produto
const produto = await getProductById('id-do-produto');
```

### Pedidos
```javascript
// Listar meus pedidos
const { pedidos } = await getMyOrders();

// Detalhes de um pedido
const pedido = await getOrderById('id-do-pedido');

// Criar novo pedido
const { pedido } = await createOrder(itens, total);

// Atualizar status
await updateOrderStatus('id-do-pedido', 'enviado');
```

---

## 🔑 Variáveis Armazenadas no localStorage

Após login bem-sucedido:

```javascript
// Token JWT (enviado em todas as requisições autenticadas)
localStorage.getItem('token')

// Dados do usuário
localStorage.getItem('usuario')
// {
//   "id": "uuid-aqui",
//   "nome": "João Silva",
//   "email": "joao@example.com"
// }
```

---

## ⚙️ Configuração da URL da API

**Edite a variável `API_URL` em `criarconta.js`, `login.js` e `auth.js`:**

```javascript
// Para desenvolvimento local:
const API_URL = 'http://localhost:3000/api';

// Para produção (Vercel):
const API_URL = 'https://seu-backend.vercel.app/api';
```

---

## 🧪 Testando a Integração

### 1. **Iniciar o Backend**
```bash
cd api
npm install  # Primeira vez
npm run dev
```

### 2. **Configurar PostgreSQL**
```bash
# Criar banco de dados
createdb frcomerce

# Executar schema
psql -U postgres -d frcomerce -f api/config/schema.sql
```

### 3. **Copiar .env**
```bash
cp .env.example .env
# Editar com suas credenciais PostgreSQL
```

### 4. **Abrir o Frontend**
- Abra `criarconta.html` no navegador
- Tente criar uma conta
- Verifique o console do navegador (F12) para erros

---

## 🐛 Troubleshooting

### "Erro ao conectar com o servidor"
**Solução:** Verifique se:
1. API está rodando: `npm run dev`
2. URL da API está correta em `API_URL`
3. CORS está habilitado (já configurado)

### "Email já cadastrado"
**Solução:** Use um email que ainda não foi registrado

### "Email ou senha incorretos"
**Solução:** Verifique se:
1. Email e senha estão corretos
2. Usuário foi criado (você criou a conta?)

### Token expirado ao usar a app
**Solução:** Login novamente (token expira em 7 dias)

---

## 📚 Exemplo Completo - Página de Perfil

```html
<!DOCTYPE html>
<html>
<head>
    <title>Meu Perfil</title>
    <script src="assets/js/auth.js"></script>
</head>
<body>
    <script>
        // Proteger página
        protegerPagina();
        
        // Carregar perfil ao abrir
        async function carregarPerfil() {
            try {
                const perfil = await getProfile();
                document.getElementById('nome').value = perfil.nome;
                document.getElementById('email').value = perfil.email;
            } catch (error) {
                alert('Erro ao carregar perfil');
            }
        }
        
        // Atualizar perfil
        async function atualizarPerfil() {
            const nome = document.getElementById('nome').value;
            const telefone = document.getElementById('telefone').value;
            
            try {
                await updateProfile(nome, telefone);
                alert('Perfil atualizado!');
            } catch (error) {
                alert('Erro ao atualizar');
            }
        }
        
        carregarPerfil();
    </script>

    <h1>Olá, <span data-user-name>Usuário</span>!</h1>
    
    <form>
        <input type="text" id="nome" placeholder="Nome">
        <input type="email" id="email" disabled placeholder="Email">
        <input type="tel" id="telefone" placeholder="Telefone">
        <button type="button" onclick="atualizarPerfil()">Salvar</button>
        <button type="button" onclick="logout()">Sair</button>
    </form>
</body>
</html>
```

---

## 📞 Status das Integrações

- ✅ **Registro (CREATE)** - Funcionando
- ✅ **Login (READ)** - Funcionando
- ✅ **Perfil (READ)** - Pronto para usar
- ✅ **Atualizar Perfil (UPDATE)** - Pronto para usar
- ✅ **Listar Produtos (READ)** - Pronto para usar
- ✅ **Gerenciar Pedidos (CRUD)** - Pronto para usar
- ✅ **Autenticação JWT** - Implementada

---

## 🎯 Próximas Etapas Sugeridas

1. **Página de Produtos** - Listei e exibir produtos da API
2. **Página de Carrinho** - Salvar itens, criar pedido
3. **Página de Pedidos** - Listar e acompanhar pedidos
4. **Pagamento** - Integrar com gateway (Stripe, PayPal, etc)
5. **Admin Panel** - Gerenciar produtos, pedidos, usuários

---

**Pronto! Seu frontend está conectado ao backend!** 🎉
