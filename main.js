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
const usuarioId = document.querySelector("#usuario-id");
const usuarioSenha = document.querySelector("#usuario-senha");
const usuarioSenhaConfirm =document.querySelector("#usuario-senha-confirm"); 

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

function cpfValido(cpfDigitosString) {
    if (!cpfDigitosString.match(/\d{11}/)) return false;

    const digitos = cpfDigitosString.split("").map(d => parseInt(d));
    function dv(posicao, digitosNumericos) {
        let aux = posicao + 1;
        const soma = digitosNumericos.slice(0, posicao)
            .reduce((soma, d) => soma + d * aux--, 0);
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }
  
    return dv(9, digitos) === digitos[9] && dv(10, digitos) === digitos[10];
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
function validarSexo() {
    if (sexo.value == "") {
        exibirErro(sexo, "Campo obrigatório");
    }
    else {
        recolherErro(sexo);
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
function validarConfirmacaoSenhas() {
    if (usuarioSenha.value != usuarioSenhaConfirm.value) {
        exibirErro(usuarioSenhaConfirm, "Senhas diferem")
    }
    else {
        recolherErro(usuarioSenhaConfirm);
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

const formStorageItem = "formulario-inscricao-rascunho";

function carregarRascunho() {
    formStorage.load(formStorageItem);
}

function salvarRascunho() {
    const campos = document.querySelectorAll('.campo-check, .campo-radio, .campo-padrao, .campo-arquivo');
    formStorage.save(formStorageItem, campos);
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
    validarUsuarioId();
    validarUsuarioSenha();
    validarConfirmacaoSenhas();
    if (form.checkValidity()) {
        localStorage.setItem(formStorageItem, "");
        localStorage.setItem("usuario-id", usuarioId.value);
        form.submit();

    }
}