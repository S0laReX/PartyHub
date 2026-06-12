import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import BuyTicket from "./pages/BuyTicket";
import MyPurchases from "./pages/MyPurchases";
import DashboardAccess from "./pages/DashboardAccess";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardOrganizer from "./pages/DashboardOrganizer";
import Statistics from "./pages/Statistics";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<BuyTicket />} />
        <Route path="/mis-compras" element={<MyPurchases />} />
        <Route path="/dashboard-acceso" element={<DashboardAccess />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/dashboard-organizador" element={<DashboardOrganizer />} />
        <Route path="/estadisticas" element={<Statistics />} />
        <Route path="/notificaciones" element={<Notifications />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;