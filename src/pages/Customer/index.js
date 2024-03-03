import { useState, useRef, useContext } from "react";
import "./customer.css";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlusCircle,
  FiLogOut,
} from "react-icons/fi";
import Modal from "../../components/Modal";
import ConBox from "../ConBox";
import { AuthContext } from "../../contexts/auth";
<style>
  @import
  url('https://fonts.googleapis.com/css2?family=Playpen+Sans:wght@200&family=Raleway:wght@200&display=swap');
</style>;

export default function Custumer() {
  var months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  var date = new Date();

  function HandleHeader(action, type) {
    let m = month;
    let y = year;
    /*anterior*/
    if (action === 0) {
      /* mês */
      if (type === 0) {
        m = m - 1;
      }
      /* ano */
      if (type === 1) {
        y = y - 1;
      }
    }
    /*próximo*/
    if (action === 1) {
      /* mês */
      if (type === 0) {
        m = m + 1;
      }
      /* ano */
      if (type === 1) {
        y = y + 1;
      }
    }
    if (action === 1 && month === 11 && type === 0) {
      m = 0;
      y = y + 1;
    }

    if (action === 0 && month === 0 && type === 0) {
      m = 11;
      y = y - 1;
    }

    setMonth(m);
    setYear(y);
  }

  function toggleModal(item) {
    setShowPostModal(!showPostModal);
    setDetail(item);
  }

  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());
  const dropDownRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();
  const { logout } = useContext(AuthContext);

  return (
    <div className="base">
      <div className="corpo">
        <div className="head-corpo">
          <div className="month">
            <button onClick={() => HandleHeader(0, 0)}>
              <FiChevronLeft size={30} color="rgba(0, 0, 0, 0.6)" />
            </button>
            <h1 id="month-header">{months[month]}</h1>
            <button onClick={() => HandleHeader(1, 0)}>
              <FiChevronRight size={30} color="rgba(0, 0, 0, 0.6)" />
            </button>
          </div>
          <div className="year">
            <button onClick={() => HandleHeader(0, 1)}>
              <FiChevronLeft size={30} color="rgba(0, 0, 0, 0.6)" />
            </button>
            <h1>{year}</h1>
            <button onClick={() => HandleHeader(1, 1)}>
              <FiChevronRight size={30} color="rgba(0, 0, 0, 0.6)" />
            </button>
          </div>
          <div className="btn-menu">
            <button onClick={() => setIsActive(!isActive)}>
              <FiPlusCircle size={30} color="rgba(255, 255, 255, 1)" />
            </button>
            <nav
              style={{ zIndex: 1 }}
              ref={dropDownRef}
              className={`btn-menu ${isActive ? "active" : "inactive"}`}
            >
              <button
                className="item"
                id="rec"
                style={{ backgroundColor: "#2be462" }}
                onClick={() => toggleModal(1)}
              >
                Receita
              </button>
              <button
                className="item"
                id="desp"
                style={{ backgroundColor: "#D65DB1" }}
                onClick={() => toggleModal(2)}
              >
                Despesa
              </button>
              <button
                className="item"
                id="res"
                style={{ backgroundColor: "#008E9B" }}
                onClick={() => toggleModal(3)}
              >
                Reserva
              </button>
            </nav>
          </div>
        </div>
        <form className="principal">
          <ConBox mes={month} ano={year} />
        </form>
      </div>
      {showPostModal && (
        <Modal
          conteudo={detail}
          close={() => setShowPostModal(!showPostModal)}
          mes={month}
          ano={year}
        />
      )}
      <div className="sair">
        <button className="btn-sair" onClick={() => logout()}>
          <FiLogOut color="#dc143c" size={20} />
          Sair
        </button>
      </div>
    </div>
  );
}
