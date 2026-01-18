// Configurar URL da API
const API_URL = 'http://localhost:3000/api'; // Mude para sua URL de produção

async function criarConta(event) {
    if (event) event.preventDefault();
    
    const nome = document.querySelector('#nome').value.trim();
    const email = document.querySelector('#email').value.trim();
    const senha = document.querySelector('#senha').value;
    const btnCriar = document.querySelector('#criar');

    // Validação básica
    if (!nome || !email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (!email.includes("@")) {
        alert("Por favor, insira um email válido.");
        return;
    }

    if (senha.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    // Desabilitar botão durante envio
    btnCriar.disabled = true;
    btnCriar.textContent = "Criando conta...";

    try {
        const response = await fetch(`${API_URL}/auth/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                email,
                senha
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.erro || "Erro ao criar conta. Tente novamente.");
            btnCriar.disabled = false;
            btnCriar.textContent = "Criar Conta";
            return;
        }

        // Sucesso - salvar token e redirecionar
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        alert("Conta criada com sucesso! Redirecionando para o login...");
        window.location.href = "login.html";
    } catch (error) {
        console.error('Erro:', error);
        alert("Erro ao conectar com o servidor. Verifique se a API está rodando.");
        btnCriar.disabled = false;
        btnCriar.textContent = "Criar Conta";
    }
}