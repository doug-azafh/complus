import { useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import { soLetras, soNumeros } from "../../schema/validation.js";
import InputMask from "react-input-mask";
import Loading from "../../components/Loading";

export default function SingUp() {
  const name = useRef("");
  const email = useRef("");
  const cpf = useRef("");
  const nascimento = useRef();

  const [password, setPassword] = useState(null);
  const [passwordC, setPasswordC] = useState(null);

  const { singUp, loadingAuth } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!soLetras(name.current.value, name.current.name)) {
      name.current.focus();
    } else if (!soNumeros(cpf.current.value, cpf.current.name)) {
      cpf.current.focus();
    }

    if (
      name.current.value !== "" &&
      email.current.value !== "" &&
      password !== "" &&
      cpf.current.value !== "" &&
      nascimento.current.value !== ""
    ) {
      await singUp(
        email.current.value,
        password,
        name.current.value,
        cpf.current.value,
        nascimento.current.value
      );
    }
  }

  return (
    <div className="main">
      <div className="login">
        <div className="login-area"></div>

        <form className="form-sing" onSubmit={handleSubmit}>
          <h1>Cadastre-se</h1>
          <label>Nome:</label>
          <input
            ref={name}
            type="text"
            placeholder="Nome completo"
            name="nome"
          />

          <label>E-mail:</label>
          <input
            ref={email}
            type="text"
            placeholder="email@email.com"
            name="email"
          />

          <div>
            <label>
              CPF:
              <InputMask
                ref={cpf}
                className="ajust"
                type="text"
                placeholder="XXX.XXX.XXX-XX"
                name="CPF"
                mask="999.999.999-99"
              />
            </label>

            <label>
              Nascimento:
              <input
                ref={nascimento}
                type="date"
                placeholder="Data de Nascimento"
                name="data de nascimento"
                style={{ marginLeft: 5 }}
              />
            </label>
          </div>
          <label>
            Senha:
            <input
              className="ajust"
              type="password"
              placeholder="********"
              value={password}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label>
            Confirme a senha:
            <input
              className="ajust"
              type="password"
              placeholder="********"
              value={passwordC}
              onChange={(e) => setPasswordC(e.target.value)}
            />
          </label>
          {password !== "" && passwordC !== "" && password !== passwordC ? (
            <span className="error">As senhas não conferem!</span>
          ) : (
            <div></div>
          )}
          <button type="submit">
            {loadingAuth ? <Loading /> : "Cadastrar"}
          </button>
        </form>
        <Link to="/">Já possui uma conta? Faça login!</Link>
      </div>
    </div>
  );
}
