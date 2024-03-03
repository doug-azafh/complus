import { useState, useRef, useContext, useEffect, useCallback } from "react";
import "./conbox.css";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseConnection";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  orderBy,
  where,
  and,
  limit,
  startAfter,
  query,
  deleteDoc,
} from "firebase/firestore";
import { FiEdit3, FiTrash } from "react-icons/fi";
import { format } from "date-fns";

export default function ConBox({ mes, ano }) {
  const listRef = collection(db, "contas");
  const { user } = useContext(AuthContext);
  const [receita, setReceita] = useState(0);
  const [despesa, setDespesa] = useState(0);
  const [reserva, setReserva] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [contas, setContas] = useState([]);
  const [isActive, setIsActive] = useState(false);

  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [loadingMore, setLoadingMore] = useState(false);

  const getCountContas = useCallback(() => {
    return contas.length;
  }, [contas]);

  useEffect(() => {
    async function loadContas() {
      const userCurrent = user.uid;
      const q = query(
        listRef,
        and(
          where("usuario", "==", userCurrent),
          where("ano", "==", ano),
          where("mes", "==", mes)
        )
      );

      const querySnapshot = await getDocs(q);
      setContas([]);

      await updateState(querySnapshot);
    }

    loadContas();

    return () => {};
  }, [ano, mes]);

  function handleMoreInfo() {
    setIsActive(!isActive);

    contas.forEach((item) => {
      console.log(item.tipo);
      if (item.tipo == 1) {
        setReceita(receita + item.valor);
      }
      if (item.tipo == 2) {
        setDespesa(despesa + item.valor);
      }
      if (item.tipo == 3) {
        setReserva(reserva + item.valor);
      }
      setSaldo(receita + reserva - despesa);
    });
  }

  async function updateState(querySnapshot) {
    const isCollectionEmpty = querySnapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      await querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        lista.push({
          id: doc.id,
          desc: doc.data().desc,
          valor: doc.data().valor,
          categoria: doc.data().categoria,
          cor: doc.data().cor,
          data: doc.data().data,
          tipo: doc.data().tipo,
        });
      });

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]; // Pegando o ultimo item

      setContas((contas) => [...contas, ...lista]);
      setLastDocs(lastDoc);
    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);
  }

  async function deleteConta(id) {
    console.log(id);
    const docRef = doc(db, "contas", id);
    await deleteDoc(docRef)
      .then(() => {
        console.log("Deletado com sucesso");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <div class={`table ${isActive ? "active" : "inactive"}`}>
        <h2 class="heading">Contas</h2>
        {contas.length === 0 ? (
          <span className="nothing">Nenhum conta cadastrada...</span>
        ) : (
          <>
            {contas.map((item, index) => {
              return (
                <div class="block" key={index}>
                  <p>
                    <span
                      className="icon"
                      style={{ backgroundColor: `${item.cor}` }}
                    >
                      " "
                    </span>
                    {item.desc}
                    <span id="space">
                      {/*item.data.substring(item.data.length - 2, item.data.length) +
                    "/" +
                    item.data.substring(
                      item.data.length - 5,
                      item.data.length - 3
                    ) +
                    "/" +
                    item.data.substring(0, 4)*/}
                    </span>
                    <span class="price">
                      R$ {item.valor}
                      <a id="edit">
                        <FiEdit3 />
                      </a>
                      <a
                        id="trash"
                        onClick={() => {
                          deleteConta(item.id);
                        }}
                      >
                        <FiTrash />
                      </a>
                    </span>
                  </p>
                </div>
              );
            })}
          </>
        )}
      </div>
      <div className="more">
        <a onClick={handleMoreInfo}>Mais informações</a>
        <div className={`result ${isActive ? "active" : "inactive"}`}>
          <div className="row">
            <div style={{ color: "#2be462", fontWeight: "bold" }}>
              Receita:<a className="vlr"> R$ {receita.toFixed(2)}</a>
            </div>
            <div className="row">
              <div style={{ color: "#D65DB1", fontWeight: "bold" }}>
                Despesa:<a className="vlr"> R$ {despesa.toFixed(2)}</a>
              </div>
            </div>
          </div>
          <div className="row">
            <div style={{ color: "#008E9B", fontWeight: "bold" }}>
              Reserva:<a className="vlr"> R$ {reserva.toFixed(2)}</a>
            </div>
          </div>
          <div className="row">
            <div style={{ fontWeight: "bold" }}>
              Saldo:<a className="vlr"> R$ {saldo.toFixed(2)}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
