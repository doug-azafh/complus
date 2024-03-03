import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";

export default function Private({ children }) {
  const { singed, loading } = useContext(AuthContext);

  if (loading) {
    return (<div></div>);
  }

  if (!singed) {
    return <Navigate to="/" />;
  }

  return children;
}
