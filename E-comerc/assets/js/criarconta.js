function criarConta() {
    const nome = document.querySelector('#nome').value;
    const email = document.querySelector('#email').value;
    const senha = document.querySelector('#senha').value;

    if (nome === "" || email === "" || !email.includes("@") || senha === "" ||
        senha.length < 6 ||
        senha.length > 12 ||
        /\s/.test(senha) ||
        !/[A-Z]/.test(senha) ||
        !/[a-z]/.test(senha) ||
        !/[0-9]/.test(senha) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(senha) ||
        /[çÇ]/.test(senha) || /[áàâãäåÁÀÂÃÄÅéèêëÉÈÊËíìîïÍÌÎÏóòôõöÓÒÔÕÖúùûüÚÙÛÜ]/.test(senha) ||
        /[~`´]/.test(senha) ||
        /[-_+=]/.test(senha) ||
        /[\[\]\\;/]/.test(senha) ||
        /[:,]/.test(senha) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
        alert("Por favor, preencha todos os campos.");
        return;
    }


    localStorage.setItem("Nome", nome);
    localStorage.setItem("Email", email);
    localStorage.setItem("Senha", senha);

    sessionStorage.setItem("Nome", nome);
    sessionStorage.setItem("Email", email);
    sessionStorage.setItem("Senha", senha);

    alert("Conta criada com sucesso!");
}