// Configurar URL da API
// Use URL relativa para funcionar em qualquer origem
const API_URL = '/api'; // Acessa a API na mesma origem

// Obter token da URL
function obterTokenDaURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
}

// Verificar validade do token ao carregar a página
async function verificarToken() {
    const token = obterTokenDaURL();
    const carregando = document.getElementById('carregando');
    const formulario = document.getElementById('formResetarSenha');
    const erroDiv = document.getElementById('erro');
    const mensagemErro = document.getElementById('mensagemErro');

    if (!token) {
        mensagemErro.textContent = 'Token não fornecido. Solicite um novo link de recuperação.';
        erroDiv.classList.remove('hidden');
        carregando.classList.add('hidden');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/password/verificar-token?token=${token}`, {
            method: 'GET'
        });

        const data = await response.json();

        if (!response.ok || !data.valido) {
            mensagemErro.textContent = 'Token inválido ou expirado. Solicite um novo link de recuperação.';
            erroDiv.classList.remove('hidden');
            carregando.classList.add('hidden');
            return;
        }

        // Token válido - mostrar formulário
        carregando.classList.add('hidden');
        formulario.classList.remove('hidden');

    } catch (error) {
        console.error('Erro ao verificar token:', error);
        mensagemErro.textContent = 'Erro ao verificar token. Tente novamente.';
        erroDiv.classList.remove('hidden');
        carregando.classList.add('hidden');
    }
}

// Resetar senha
async function resetarSenha(event) {
    if (event) event.preventDefault();

    const token = obterTokenDaURL();
    const novaSenha = document.querySelector("#novaSenha").value;
    const confirmaSenha = document.querySelector("#confirmaSenha").value;
    const btnResetar = document.querySelector("#btnResetar");

    // Validações
    if (!novaSenha || !confirmaSenha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (novaSenha.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    if (novaSenha !== confirmaSenha) {
        alert("As senhas não conferem.");
        return;
    }

    // Desabilitar botão
    btnResetar.disabled = true;
    btnResetar.textContent = "Processando...";

    try {
        const response = await fetch(`${API_URL}/password/resetar-senha`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token,
                novaSenha,
                confirmaSenha
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.erro || "Erro ao resetar senha.");
            btnResetar.disabled = false;
            btnResetar.textContent = "Resetar Senha";
            return;
        }

        alert(data.mensagem || "Senha resetada com sucesso!");
        
        // Redirecionar para login
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);

    } catch (error) {
        console.error('Erro:', error);
        alert("Erro ao conectar com o servidor.");
        btnResetar.disabled = false;
        btnResetar.textContent = "Resetar Senha";
    }
}

// Executar ao carregar a página
document.addEventListener('DOMContentLoaded', verificarToken);
