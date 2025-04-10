const form = document.querySelector("#formulario-login");

const usuarioId = document.querySelector("#usuario-id");
const usuarioSenha = document.querySelector("#usuario-senha");

function validarFormulario(event) {
    event.preventDefault();
    validarUsuarioId();
    validarUsuarioSenha();
    if (form.checkValidity()) {
        form.submit();
    }
}