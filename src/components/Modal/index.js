import { useState, useRef, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/auth";
import { FiX, FiCheck, FiPlusCircle } from "react-icons/fi";
import "./modal.css";
import { auth, db } from "../../services/firebaseConnection";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  orderBy,
  where,
  query,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Catmodal from "../../components/Modal/Catmodal";

/*const categoria = [
  "Laser",
  "Roupas",
  "Entretenimento",
  "Alimentos",
  "Viagens",
  "Educação",
  "Moradia",
];*/

const color = [
  "#FCB900",
  "#0693E3",
  "#00D084",
  "#EB144C",
  "#FF6900",
  "#ABB8C3",
  "#9900EF",
];

const modo = ["Único lançamento", "Fixo", "Parcelado"];

export default function Modal({ conteudo, close, mes, ano }) {
  const [mod, setMod] = useState(0);
  const [cat, setCat] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [cor, setCor] = useState(null);
  const parc = useRef("");
  const desc = useRef("");
  const valor = useRef(0);
  const data = useRef("");
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();
  const listRef = collection(db, "categoria");
  const { user } = useContext(AuthContext);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    async function loadCategoria() {
      const userCurrent = user.uid;
      const q = query(listRef, where("usuario", "==", userCurrent), orderBy("desc"));

      const querySnapshot = await getDocs(q);
      setCategorias([]);

      await updateState(querySnapshot);
    }

    loadCategoria();

    return () => {};
  }, [categorias]);

  async function updateState(querySnapshot) {
    const isCollectionEmpty = querySnapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      await querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          cor: doc.data().cor,
          categoria: doc.data().desc,
        });
      });

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]; // Pegando o ultimo item

      setCategorias((categorias) => [...categorias, ...lista]);
      setLastDocs(lastDoc);
    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);
  }

  const navigate = useNavigate();

  function toggleModal(item) {
    setShowPostModal(!showPostModal);
    setDetail(item);
  }

  function handleCat(e) {
    const id = e.substring(0, e.length - 7);
    const color = e.substring(e.length - 7, e.length);
    setCat(id);
    setCor(color);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await cadConta(
      user.uid,
      conteudo,
      ano,
      mes,
      cat,
      cor,
      parseInt(mod),
      parseInt(parc.current.value) ?? 0,
      desc.current.value,
      parseFloat(valor.current.value),
      data.current.value
    ).then(() => {
      close();
    });
  }

  async function cadConta(
    usuario,
    tipo,
    ano,
    mes,
    categoria,
    cor,
    tipoLanc,
    parc,
    desc,
    valor,
    data
  ) {
    await addDoc(collection(db, "contas"), {
      usuario: usuario,
      tipo: tipo,
      ano: ano,
      mes: mes,
      categoria: categoria,
      cor: cor,
      tipoLanc: tipoLanc,
      parc: parc,
      desc: desc,
      valor: valor,
      data: data,
    })
      .then(() => {
        console.log("cadastro efetuado");
        navigate("/custumer");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="modal">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <main>
            <h2>
              {conteudo === 1
                ? "Receita"
                : conteudo === 2
                ? "Despesa"
                : "Reserva"}
            </h2>

            <div className="row add-cat">
              <label>Categoria:</label>
              <select
                className="sel g"
                onClick={(e) => handleCat(e.target.value)}
                defaultValue={"Selecione uma categoria..."}
              >
                {categorias.length === 0 ? (
                  <option key={0} className="sel g">
                    Nenhuma categoria cadastrada...
                  </option>
                ) : (
                  <>
                    {categorias.map((item, index) => {
                      return (
                        <option
                          key={item.id}
                          value={item.id + item.cor}
                          style={{ backgroundColor: `${item.cor}` }}
                          className="sel g"
                        >
                          {item.categoria}
                        </option>
                      );
                    })}
                  </>
                )}
              </select>

              <a onClick={() => toggleModal(1)}>
                <FiPlusCircle size={20} />
              </a>
            </div>

            <div className="row">
              <label>Tipo:</label>
              <select
                className="sel m s"
                onClick={(e) => {
                  setMod(e.target.value);
                }}
              >
                {modo.map((item, i) => (
                  <option value={i}>{modo[i]}</option>
                ))}
              </select>
              {mod === "2" ? (
                <>
                  <label>Vezes:</label>
                  <input className="sel p" type="text" ref={parc} />
                </>
              ) : (
                <div></div>
              )}
            </div>

            <div className="row">
              <label>Descrição:</label>
              <input ref={desc} className="sel g" type="text" />
            </div>

            <div className="row">
              <label>Valor:</label>
              <input ref={valor} className="sel m" type="text" />

              <label>Data:</label>
              <input ref={data} className="sel m" type="date" />
            </div>
          </main>

          <div className="btn">
            <button className="close" onClick={close}>
              <FiX size={25} color="#FFF" />
            </button>

            <button className="save" type="submit">
              <FiCheck size={25} color="#FFF" />
            </button>
          </div>
        </form>
      </div>
      {showPostModal && (
        <Catmodal
          conteudo={detail}
          close={() => setShowPostModal(!showPostModal)}
        />
      )}
    </div>
  );
}
