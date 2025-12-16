import { BrowserRouter, Routes, Route } from "react-router-dom";
import Adminpanelpage from "./pages/adminpanelpage";
import AdminInfo from "./pages/admininfo";

export default function App2() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Adminpanelpage />} />
        <Route path="/userinfo" element={<AdminInfo />} />
      </Routes>
    </BrowserRouter>
  );
}
