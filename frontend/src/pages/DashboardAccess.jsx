import { useState } from "react";
import { scanTicket } from "../services/purchaseService";

function DashboardAccess() {
  const [qrUuid, setQrUuid] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const handleScan = async () => {
    try {
      const data = await scanTicket(qrUuid);
      setResult(data);
      setHistory([data, ...history]);
      setQrUuid("");
    } catch (error) {
      const errorData = error.response?.data || {
        message: "Error al validar el ticket",
        status: "error",
      };

      setResult(errorData);
      setHistory([errorData, ...history]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-8 py-10">
      <h1 className="text-4xl font-bold text-pink-400">Dashboard Acceso</h1>
      <p className="text-slate-400 mt-2">
        Escanea o pega el código QR para validar la entrada.
      </p>

      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl">
        <label className="block text-sm text-slate-400 mb-2">
          Código QR
        </label>

        <input
          type="text"
          value={qrUuid}
          onChange={(e) => setQrUuid(e.target.value)}
          placeholder="Pega aquí el qr_uuid"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-pink-400"
        />

        <button
          onClick={handleScan}
          className="mt-4 w-full bg-pink-500 hover:bg-pink-600 py-2 rounded-lg font-semibold"
        >
          Validar Ticket
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-slate-900 border border-pink-500 rounded-xl p-4 max-w-xl">
          <h3 className="text-xl font-bold">{result.message}</h3>
          <p className="text-slate-400">Estado: {result.status}</p>
        </div>
      )}

      <div className="mt-8 max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Historial</h2>

        <div className="space-y-3">
          {history.map((item, index) => (
            <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p>{item.message}</p>
              <p className="text-sm text-slate-400">{item.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardAccess;