function obterAlertaSpan(input) {
    return input.parentElement.querySelector(".alerta") ?? input.parentElement.parentElement.querySelector(".alerta");
}
function exibirErro(input, mensagem) {
    const alerta = obterAlertaSpan(input);
    alerta.textContent = mensagem;

    input.classList.add("campo-padrao--invalido");
    alerta.classList.remove("alerta--escondido");
}
function recolherErro(input) {
    const alerta = obterAlertaSpan(input);
    alerta.textContent = "";

    input.classList.remove("campo-padrao--invalido");
    alerta.classList.add("alerta--escondido");
}

const formStorage = {
    load(item) {
        let dados = localStorage.getItem(item);
        if (dados === null) return;
        
        dados = JSON.parse(dados);
        for (const name in dados) {
            const {type, value} = dados[name];
            const elements = Array.from(document.getElementsByName(name));

            if (type == "checkbox") {
                elements.forEach(el => {el.checked = value});
            }
            else if (type == "radio") {
                elements.forEach(el => {el.checked = (el.value == value)})
            }
            else {
                elements.forEach(el => el.value = value);
            }
        }
    },
    save(item, elements) {
        const dados = {};
        for (const el of elements) {
            let type, value;
            if (el?.type == "checkbox") {
                type = "checkbox";
                value = el.checked;
            }
            else if (el?.type == "radio") {
                const inputChecked = document.querySelector(`[name="${el.name}"]:checked`);
                type = "radio";
                value = inputChecked ? inputChecked.value : "";
            }
            else {
                type = "default",
                value = el.value;
            }
            dados[el.name] = {type, value};
        }
        
        localStorage.setItem(item, JSON.stringify(dados));
    }
}

function validarUsuarioId() {
    if (usuarioId.validity.valueMissing) {
        exibirErro(usuarioId, "Campo obrigatório");
    }
    else {
        recolherErro(usuarioId);
    }
}
function validarUsuarioSenha() {
    if (usuarioSenha.validity.valueMissing) {
        exibirErro(usuarioSenha, "Campo obrigatório");
    }
    else {
        recolherErro(usuarioSenha);
    }
}