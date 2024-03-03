import { toast } from "react-toastify";

function isnotNull(value, name) {
  let message;

  if (value === "") {
    message = `O campo ${name} é obrigatório`;

    return toast.info(message);
  }
}

function soLetras(value, name) {
  let message;
  let valor = [value];
  let regex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;

  if (!isnotNull(value, name)) {
    valor.forEach((e) => {
      let valido = e.split(/ +/).every((parte) => regex.test(parte));
      if (!valido) {
        message = `O campo ${name} não pode conter números`;
      }
    });

    return toast.info(message);
  }
}

function soNumeros(value, name) {
    let message;
    let valor = [value];
    let regex = /[0-9]/;
  
    if (!isnotNull(value, name)) {
        valor.forEach((e) => {
        let valido = e.split(/ +/).every((parte) => regex.test(parte));
        if (!valido) {
          message = `O campo ${name} não pode conter letras`;
        }
      });
      
      return toast.info(message);
    }
  }

export {isnotNull, soLetras, soNumeros};