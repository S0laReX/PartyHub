import { useEffect, useState } from "react";
import { getOrganizerDashboard } from "../services/dashboardService";
import StatsCard from "../components/dashboard/StatsCard";

function DashboardOrganizer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const response = await getOrganizerDashboard();
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
      <h1 className="text-4xl font-bold text-pink-400">Dashboard Organizador</h1>
      <p className="text-slate-400 mt-2">Resumen de mis eventos y ventas.</p>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <StatsCard title="Mis eventos" value={data.my_events} />
        <StatsCard title="Ventas" value={data.sales} />
        <StatsCard title="Ganancias" value={`${data.earnings} Bs`} />
        <StatsCard title="Tickets vendidos" value={data.tickets_sold} />
        <StatsCard title="Asistentes" value={data.attendees} />
      </div>
    </div>
  );
}

export default DashboardOrganizer;