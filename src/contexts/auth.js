import { useState, createContext, useEffect } from "react";
import { auth, db } from "../services/firebaseConnection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [stateMenu, setStateMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      const storageUser = localStorage.getItem("@comp");
      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }

      setLoading(false);
    }
    loadUser();
  }, []);

  async function statusMenu() {
    setStateMenu(!stateMenu);
  }

  /*async function singInWithGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, )
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }*/

  async function singIn(email, password) {
    setLoadingAuth(true);

    await signInWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        let data = {
          uid: uid,
          nome: docSnap.data().nome,
          email: value.user.email,
          avatarUrl: docSnap.data().avatarUrl,
          cpf: docSnap.data().cpf,
          nascimento: docSnap.data().nascimento,
        };

        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
        toast.success("Bem-vindo(a) de volta");
        navigate("/custumer");
      })
      .catch((error) => {
        console.log(error);
        setLoadingAuth(false);
        toast.error("Ops algo deu errado!");
      });
  }

  async function singUp(email, password, name, cpf, nascimento) {
    setLoadingAuth(true);

    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;
        await setDoc(doc(db, "users", uid), {
          nome: name,
          avatarUrl: null,
          cpf: cpf,
          nascimento: nascimento,
        }).then(() => {
          let data = {
            uid: uid,
            nome: name,
            email: value.user.email,
            avatarUrl: null,
            cpf: cpf,
            nascimento: nascimento,
          };
          setUser(data);
          storageUser(data);
          setLoadingAuth(false);
          toast.success("Seja bem-vindo!");
          navigate("/custumer");
        });
      })
      .catch((error) => {
        console.log(error);
        setLoadingAuth(false);
      });
  }

  function storageUser(data) {
    localStorage.setItem("@comp", JSON.stringify(data));
  }

  async function logout() {
    await signOut(auth);
    localStorage.removeItem("@comp");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        singed: !!user,
        user,
        singIn,
        singUp,
        logout,
        loadingAuth,
        loading,
        storageUser,
        setUser,
        statusMenu,
        stateMenu,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
