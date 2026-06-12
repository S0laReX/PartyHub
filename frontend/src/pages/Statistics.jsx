import { useEffect, useState } from "react";
import { getRankingEvents } from "../services/dashboardService";

function Statistics() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const response = await getRankingEvents();
    setRanking(response);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-8 py-10">
      <h1 className="text-4xl font-bold text-pink-400">Estadísticas</h1>
      <p className="text-slate-400 mt-2">Ranking de eventos más vendidos.</p>

      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Ranking Eventos</h2>

        <div className="space-y-3">
          {ranking.map((item, index) => (
            <div
              key={index}
              className="flex justify-between bg-slate-800 rounded-xl p-4"
            >
              <span>{index + 1}. {item.event}</span>
              <span className="text-pink-400 font-bold">{item.sales} ventas</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Statistics;