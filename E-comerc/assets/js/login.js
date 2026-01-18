function loginUser() {
    const email_user = document.querySelector("#emailuser").value;
    const senha_user = document.querySelector("#senhausuario").value;

    if (email_user === "" || senha_user === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }else {
        if (email_user === localStorage.getItem("Email") && senha_user === localStorage.getItem("Senha")) {
            alert("Login realizado com sucesso!");
            window.location.href = "index.html"; 
        } else {
            alert("Email ou senha incorretos. Tente novamente.");
        }
    }
    
}