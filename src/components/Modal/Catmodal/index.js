import { useState, useRef, useContext } from "react";
import { FiX, FiCheck, FiPlusCircle } from "react-icons/fi";
import "./modalCat.css";
import { AuthContext } from "../../../contexts/auth";
import { db } from "../../../services/firebaseConnection";
import { addDoc, collection } from "firebase/firestore";
import Circle from "@uiw/react-color-circle";

export default function Catmodal({ conteudo, close }) {
  const [cor, setCor] = useState("");
  const desc = useRef("");
  const { user } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();
    await cadCat(user.uid, cor, desc.current.value).then(() => {
      close();
    });
  }

  async function cadCat(usuario, cor, desc) {
    await addDoc(collection(db, "categoria"), {
      usuario: usuario,
      cor: cor,
      desc: desc,
    })
      .then(() => {
        console.log("cadastro efetuado");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="modal-cat">
      <div className="container-cat">
        <form onSubmit={handleSubmit}>
          <main>
            <h2>Categoria</h2>

            <div className="row-cat">
              <label>Cor:</label>
              <Circle
                colors={[
                  "#D0021B",
                  "#F44336",
                  "#E91E63",
                  "#9C27B0",
                  "#673AB7",
                  "#3F51B5",
                  "#03A9F4",
                  "#00BCD4",
                  "#009688",
                  "#4CAF50",
                  "#8BC34A",
                  "#CDDC39",
                  "#FFEB3B",
                  "#FFC107",
                  "#FF9800",
                  "#FF5722",
                  "#8B572A",
                  "#795548",
                  "#607D8B",
                  "#4A4A4A",
                  "#000000",
                ]}
                color={cor}
                onChange={(color) => {
                  setCor(color.hex);
                }}
              />
              <div className="box-color" style={{ backgroundColor: `${cor}` }}>
                {cor}
              </div>
            </div>

            <div className="row-cat">
              <label>Descrição:</label>
              <input ref={desc} className="sel g-cat" type="text" />
            </div>
          </main>

          <div className="btn-cat">
            <button className="close-cat" onClick={close}>
              <FiX size={25} color="#FFF" />
            </button>

            <button className="save-cat" type="submit">
              <FiCheck size={25} color="#FFF" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
