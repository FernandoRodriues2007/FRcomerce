// Configurar URL da API
const API_URL = 'http://localhost:3000/api'; // Mude para sua URL de produção

async function recuperarSenha(event) {
    if (event) event.preventDefault();
    
    const email = document.querySelector("#email").value.trim();
    const btnRecuperar = document.querySelector("#btnRecuperar");

    // Validação
    if (!email) {
        alert("Por favor, insira seu email.");
        return;
    }

    if (!email.includes("@")) {
        alert("Por favor, insira um email válido.");
        return;
    }

    // Desabilitar botão
    btnRecuperar.disabled = true;
    btnRecuperar.textContent = "Enviando...";

    try {
        const response = await fetch(`${API_URL}/password/recuperar-senha`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        // Mostrar mensagem (seja sucesso ou não)
        alert(data.mensagem || data.erro || "Verifique seu email para instruções de recuperação de senha.");
        
        // Redirecionar para login
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);

    } catch (error) {
        console.error('Erro:', error);
        alert("Erro ao conectar com o servidor. Verifique se a API está rodando.");
        btnRecuperar.disabled = false;
        btnRecuperar.textContent = "Enviar Link de Recuperação";
    }
}
