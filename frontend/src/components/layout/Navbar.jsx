import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-950 border-b border-slate-800 text-white px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-pink-400">
        PartyHub
      </Link>

      <div className="flex gap-5 text-sm">
        <Link to="/" className="hover:text-pink-400">Comprar</Link>
        <Link to="/mis-compras" className="hover:text-pink-400">Mis Compras</Link>
        <Link to="/dashboard-acceso" className="hover:text-pink-400">Acceso QR</Link>
        <Link to="/dashboard-admin" className="hover:text-pink-400">Admin</Link>
        <Link to="/dashboard-organizador" className="hover:text-pink-400">Organizador</Link>
        <Link to="/estadisticas" className="hover:text-pink-400">Estadísticas</Link>
        <Link to="/notificaciones" className="hover:text-pink-400">Notificaciones</Link>
      </div>
    </nav>
  );
}

export default Navbar;