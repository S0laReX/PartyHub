function StatsCard({ title, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <p className="text-slate-400 text-sm">{title}</p>
      <h3 className="text-3xl font-bold text-pink-400 mt-2">{value}</h3>
    </div>
  );
}

export default StatsCard;