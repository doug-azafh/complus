import { Route, Routes } from "react-router-dom";
import Private from "./Private";
import SingIn from "../pages/SingIn";
import SingUp from "../pages/SingUp";
import Custumer from "../pages/Customer";

function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<SingIn />} />
      <Route path="/register" element={<SingUp />} />
      <Route
        path="/custumer"
        element={
          <Private>
            <Custumer />
          </Private>
        }
      />
    </Routes>
  );
}

export default RoutesApp;
