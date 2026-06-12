function TicketCard({ ticket, quantity, onQuantityChange, onBuy }) {
  const total = Number(ticket.price) * Number(quantity || 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-white">{ticket.name}</h3>
      <p className="text-slate-400 mt-2">{ticket.description}</p>

      <div className="mt-4 space-y-2 text-slate-300">
        <p>Precio: <span className="text-pink-400 font-bold">{ticket.price} Bs</span></p>
        <p>Stock: {ticket.stock}</p>
        <p>Vendidos: {ticket.sold_quantity}</p>
      </div>

      <div className="mt-5">
        <label className="block text-sm text-slate-400 mb-2">Cantidad</label>
        <input
          type="number"
          min="1"
          max={ticket.stock}
          value={quantity}
          onChange={(e) => onQuantityChange(ticket.id, e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-pink-400"
        />
      </div>

      <p className="mt-4 text-white">
        Total: <span className="font-bold text-pink-400">{total} Bs</span>
      </p>

      <button
        onClick={() => onBuy(ticket)}
        className="mt-5 w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold"
      >
        Comprar Ticket
      </button>
    </div>
  );
}

export default TicketCard;