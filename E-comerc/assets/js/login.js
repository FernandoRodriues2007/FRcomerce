// Configurar URL da API
// Use URL relativa para funcionar em qualquer origem
const API_URL = '/api'; // Acessa a API na mesma origem

async function loginUser(event) {
    if (event) event.preventDefault();
    
    const email = document.querySelector("#emailuser").value.trim();
    const senha = document.querySelector("#senhausuario").value;
    const btnLogin = document.querySelector("#btn");

    // Validação básica
    if (!email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (!email.includes("@")) {
        alert("Por favor, insira um email válido.");
        return;
    }

    // Desabilitar botão durante envio
    btnLogin.disabled = true;
    btnLogin.textContent = "Entrando...";

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                senha
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.erro || "Email ou senha incorretos. Tente novamente.");
            btnLogin.disabled = false;
            btnLogin.textContent = "Login";
            return;
        }

        // Sucesso - salvar token e dados do usuário
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        alert("Login realizado com sucesso!");
        window.location.href = "principal.html";
    } catch (error) {
        console.error('Erro:', error);
        alert("Erro ao conectar com o servidor. Verifique se a API está rodando.");
        btnLogin.disabled = false;
        btnLogin.textContent = "Login";
    }
}