import { useEffect, useState } from "react";
import { getTickets } from "../services/ticketService";
import { createPurchase } from "../services/purchaseService";
import TicketCard from "../components/tickets/TicketCard";

function BuyTicket() {
  const [tickets, setTickets] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState("");
  const [lastPurchase, setLastPurchase] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await getTickets();
      setTickets(data);

      const initialQuantities = {};
      data.forEach((ticket) => {
        initialQuantities[ticket.id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      setMessage("Error al cargar los tickets");
    }
  };

  const handleQuantityChange = (ticketId, value) => {
    setQuantities({
      ...quantities,
      [ticketId]: value,
    });
  };

  const handleBuy = async (ticket) => {
    try {
      const quantity = Number(quantities[ticket.id]);

      const data = await createPurchase({
        tickets: [
          {
            ticket_id: ticket.id,
            quantity: quantity,
          },
        ],
      });

      setMessage(data.message);
      setLastPurchase(data.purchase);
    } catch (error) {
      setMessage("Error al realizar la compra");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-8 py-10">
      <h1 className="text-4xl font-bold text-pink-400">Comprar Tickets</h1>
      <p className="text-slate-400 mt-2">
        Selecciona una entrada y genera tu compra con QR.
      </p>

      {message && (
        <div className="mt-6 bg-slate-900 border border-pink-500 rounded-xl p-4">
          {message}
        </div>
      )}

      {lastPurchase && (
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p>Código de compra: {lastPurchase.purchase_code}</p>
          <p>Total: {lastPurchase.total} Bs</p>
          <p>QR generado: <span className="text-pink-400">{lastPurchase.qr_uuid}</span></p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            quantity={quantities[ticket.id] || 1}
            onQuantityChange={handleQuantityChange}
            onBuy={handleBuy}
          />
        ))}
      </div>
    </div>
  );
}

export default BuyTicket;