import { useEffect, useState } from "react";
import { getPurchases } from "../services/purchaseService";
import { getTicketPdfUrl } from "../services/pdfService";
import { QRCodeCanvas } from "qrcode.react";

function MyPurchases() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    const data = await getPurchases();
    setPurchases(data);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-8 py-10">
      <h1 className="text-4xl font-bold text-pink-400">Mis Compras</h1>
      <p className="text-slate-400 mt-2">
        Aquí puedes ver tus tickets comprados y su QR.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold">Compra #{purchase.id}</h3>
            <p className="text-slate-400 mt-2">Código: {purchase.purchase_code}</p>
            <p>Total: {purchase.total} Bs</p>
            <p>Estado: {purchase.payment_status}</p>

            {purchase.details?.map((detail) => (
              <div key={detail.id} className="mt-5 bg-slate-800 rounded-xl p-4">
                <p>Ticket: {detail.ticket_name}</p>
                <p>Estado QR: {detail.status}</p>
                <p className="text-xs text-slate-400 break-all mt-2">
                  {detail.qr_uuid}
                </p>

                <div className="bg-white inline-block p-3 rounded-lg mt-4">
                  <QRCodeCanvas value={detail.qr_uuid} size={140} />
                </div>
              </div>
            ))}

            <a
              href={getTicketPdfUrl(purchase.id)}
              target="_blank"
              className="inline-block mt-5 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg"
            >
              Descargar PDF
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPurchases;