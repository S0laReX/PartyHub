import { useEffect, useState } from "react";
import { getAdminDashboard } from "../services/dashboardService";
import StatsCard from "../components/dashboard/StatsCard";

function DashboardAdmin() {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const response = await getAdminDashboard();
    setData(response);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8">
        Cargando dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-8 py-10">
      <h1 className="text-4xl font-bold text-pink-400">Dashboard Admin</h1>
      <p className="text-slate-400 mt-2">Resumen general de PartyHub.</p>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <StatsCard title="Usuarios" value={data.users} />
        <StatsCard title="Eventos" value={data.events} />
        <StatsCard title="Ventas" value={data.sales} />
        <StatsCard title="Ganancias" value={`${data.earnings} Bs`} />
        <StatsCard title="Tickets vendidos" value={data.tickets_sold} />
      </div>
    </div>
  );
}

export default DashboardAdmin;