let form = document.querySelector("#formulario-inscricao");

let identidade = document.querySelector("#identidade");
let residencia = document.querySelector("#residencia");
let nome = document.querySelector("#nome-completo");
let dataNascimento = document.querySelector("#data-nascimento");
let cpf = document.querySelector("#cpf");
let email = document.querySelector("#email");
let sexo = document.querySelector("#sexo");
let telefone = document.querySelector("#telefone");
let cep = document.querySelector("#cep");
let rua = document.querySelector("#rua");
let cidade = document.querySelector("#cidade");
let estado = document.querySelector("#estado");
let numeroCasa = document.querySelector("#n-casa");
let trilhaDeAprendizagem = document.querySelector('[name="trilha-de-aprendizagem"]');
let confirmacaoTermos = document.querySelector("#confirmacao-termos");

let btnInscricao = document.querySelector("#inscricao");

let cpfMask = IMask(cpf, {mask: "000.000.000-00"});
let telefoneMask = IMask(telefone, {
    mask: [
        {mask: "(00) 0000-0000"},
        {mask: "(00) 0 0000-0000"},
    ]
});
let cepMask = IMask(cep, {mask: "00000-000"});
let numeroCasaMask = IMask(numeroCasa, {mask: Number, scale: 0})


function exibirErro(input, mensagem) {
    //input.setCustomValidity(mensagem);

    let alerta = input.parentElement.querySelector(".alerta") ?? input.parentElement.parentElement.querySelector(".alerta");
    alerta.textContent = mensagem;

    input.classList.add("campo-padrao--invalido");
    alerta.classList.remove("alerta--escondido");
}
function recolherErro(input) {
    //input.setCustomValidity("");

    let alerta = input.parentElement.querySelector(".alerta") ?? input.parentElement.parentElement.querySelector(".alerta");

    input.classList.remove("campo-padrao--invalido");
    alerta.classList.add("alerta--escondido");
}
function cpfValido(cpfDigitos) {
    let digitosNumericos = cpfDigitos.split("")
        .map(d => parseInt(d));
    let aux, soma, resto;

    aux = 10;
    soma = digitosNumericos.slice(0, 9)
        .reduce((soma, d) => soma + d * aux--, 0);
    resto = soma % 11;
    let dv1 = resto < 2 ? 0 : 11 - resto;

    console.log(dv1)
    if (dv1 != digitosNumericos[9]) return false;

    aux = 11;
    soma = digitosNumericos.slice(0, 10)
        .reduce((soma, d) => soma + d * aux--, 0);
    resto = soma % 11;
    let dv2 = resto < 2 ? 0 : 11 - resto;

    console.log(dv2)
    return dv2 == digitosNumericos[10];  
}
async function buscarDadosCep(cep) {
    let res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    let json = await res.json();

    if (json.erro) {
        return {erro: true};
    }
    return {
        cep: json.cep,
        estado: json.uf,
        cidade: json.localidade,
        rua: json.logradouro
    }

}
function validarArquivo(input) {
    if (input.files.length == 0) {
        exibirErro(input, "É obrigatório enviar um arquivo");
    }
    else {
        let f = input.files.item(0);
        if (!f.name.endsWith(".pdf")) {
            exibirErro(input, "O arquivo deve estar no formato pdf");
        }
        else {
            recolherErro(input);
        }
    }
}
function atualizarArquivo(input) {
    let selecionado = input.parentElement.querySelector(".campo-arquivo__selecionado");
    let nome = input.files.item(0).name;
    selecionado.textContent = nome;
    selecionado.classList.remove("campo-arquivo__selecionado--escondido");
}
function validarNome() {
    if (nome.validity.valueMissing) {
        exibirErro(nome, "Campo obrigatório");
    }
    else {
        recolherErro(nome);
    }
}
function validarDataNascimento() {
    if (! dataNascimento.validity.valid) {
        exibirErro(dataNascimento, "Data em formato inválido");
    }
    else {
        recolherErro(dataNascimento);
    }
}
function validarCpf() {
    if (cpf.validity.valueMissing) {
        exibirErro(cpf, "Campo obrigatório");
    }
    else if (cpf.validity.patternMismatch) {
        exibirErro(cpf, "Insira um CPF válido")
    }
    else if (!cpfValido(cpfMask.unmaskedValue)){
        exibirErro(cpf, "CPF não existe. Verifique se digitou o seu CPF corretamente");
    }
    else {
        recolherErro(cpf);
    }
}
function validarEmail() {
    if (email.validity.valueMissing) {
        exibirErro(email, "Campo obrigatório");
    }
    else if (email.validity.typeMismatch) {
        exibirErro(email, "Insira um e-mail válido");
    }
    else {
        recolherErro(email);
    }
}
function validarTelefone() {
    if (telefone.validity.valueMissing) {
        exibirErro(telefone, "Campo obrigatório");
    }
    else if (telefone.validity.patternMismatch) {
        exibirErro(telefone, "Insira um telefone válido");
    }
    else {
        recolherErro(telefone);
    }
}
function validarCep() {
    if (cep.validity.valueMissing) {
        exibirErro(cep, "Campo obrigatório");
    }
    else if (cep.validity.patternMismatch) {
        exibirErro(cep, "Insira um CEP válido");
    }
    else {
        recolherErro(cep);
    }
}
function validarNumeroCasa() {
    if (numeroCasa.validity.valueMissing) {
        exibirErro(numeroCasa, "Campo obrigatório");
    }
    else if (numeroCasa.validity.patternMismatch) {
        exibirErro(numeroCasa, "Insira um número válido");
    }
    else {
        recolherErro(numeroCasa);
    }
}
function validarTrilhaDeAprendizagem() {
    if (trilhaDeAprendizagem.validity.valueMissing) {
        exibirErro(trilhaDeAprendizagem, "É necessário escolher uma trilha");
    }
    else {
        recolherErro(trilhaDeAprendizagem);
    }
}
function validarConfirmacaoTermos() {
    if (!confirmacaoTermos.checked) {
        exibirErro(confirmacaoTermos, "É necessário aceitar os termos e política de privacidade para realizar a inscrição");
    }
    else {
        recolherErro(confirmacaoTermos);
    }
}

function preencherCamposCep() {
    if (cep.validity.valid) {
        rua.classList.toggle("campo-padrao--loading");
        cidade.classList.toggle("campo-padrao--loading");
        estado.classList.toggle("campo-padrao--loading");

        buscarDadosCep(cepMask.unmaskedValue).then(dados => {
            rua.classList.toggle("campo-padrao--loading");
            cidade.classList.toggle("campo-padrao--loading");
            estado.classList.toggle("campo-padrao--loading");
            if (dados.erro) {
                exibirErro(cep, "CEP não encontrado");
            }
            else {
                recolherErro(cep);
                rua.value = dados.rua;
                cidade.value = dados.cidade;
                estado.value = dados.estado;
            }
        });
    }
    
}

function validarFormulario(event) {
    event.preventDefault();
    validarArquivo(identidade);
    validarArquivo(residencia);
    validarNome();
    validarDataNascimento();
    validarCpf();
    validarEmail();
    validarTelefone();
    validarCep();
    validarConfirmacaoTermos();
    validarTrilhaDeAprendizagem();
    if (form.checkValidity()) {
        form.submit();
    }
}