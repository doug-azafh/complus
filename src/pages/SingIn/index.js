import { useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import "./singin.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Loading from "../../components/Loading";

export default function SingIn() {
  const [user, setUser] = useState("");
  const password = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const { singIn, loadingAuth } = useContext(AuthContext);

  function toggleShow(e) {
    e.preventDefault();
    if (password.current.type === "password") {
      setShowPassword(true);
      password.current.type = "text";
    } else {
      setShowPassword(false);
      password.current.type = "password";
    }
  }

  async function handleSignIn(e) {
    e.preventDefault();

    if ((user !== "") & (password !== "")) {
      await singIn(user, password.current.value);
    }
  }

  return (
    <div className="main">
      <div className="login">
        <div className="login-area"></div>
        <form className="form-sing" onSubmit={handleSignIn}>
          <h1>Entrar</h1>
          <input
            type="text"
            placeholder="Digite o CPF ou e-mail cadastrado"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <form className="password">
            <input ref={password} type="password" placeholder="********" />
            <button onClick={(e) => toggleShow(e)}> 
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </form>

          <button type="submit">{loadingAuth ? <Loading /> : "Acessar"}</button>
        </form>
        <Link to="/register">Criar uma conta</Link>
      </div>
    </div>
  );
}
