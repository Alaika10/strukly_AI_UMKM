export const StatCard = ({ title, amount, trend, type = "default", progress }) => {
  const isPrimary = type === "primary";
  
  return (
    <div className={`${
      isPrimary ? "bg-primary text-on-primary" : "bg-surface-container-lowest border-b-4"
    } p-8 rounded-xl shadow-sm group hover:translate-y-[-4px] transition-all duration-300 relative overflow-hidden ${
      type === "inflow" ? "border-secondary/20" : type === "outflow" ? "border-error/20" : ""
    }`}>
      {isPrimary && (
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <span className="material-symbols-outlined text-8xl">account_balance</span>
        </div>
      )}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <span className={`${isPrimary ? "text-primary-fixed/70" : "text-on-surface-variant"} text-sm font-bold uppercase tracking-widest`}>{title}</span>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isPrimary ? "bg-white/20" : "bg-slate-100"
          }`}>
            <span className="material-symbols-outlined">{type === "inflow" ? "trending_up" : type === "outflow" ? "trending_down" : "savings"}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-extrabold tracking-tight">{amount}</span>
          {trend && (
            <div className="mt-4 flex items-center gap-2">
              <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${
                trend.startsWith('+') ? "text-secondary bg-secondary-container" : "text-error bg-error-container"
              }`}>{trend}</span>
              <span className="text-[12px] opacity-70 text-on-surface-variant">vs bulan lalu</span>
            </div>
          )}
          {progress && (
            <div className="mt-4">
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-secondary-container rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-[11px] mt-2 text-primary-fixed/60">{progress}% dari target tabungan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ActionButton = ({ icon, title, desc, colorClass , onClick}) => (
  <button 
    className="flex flex-col items-start p-8 bg-surface-container-low hover:bg-surface-container-highest rounded-2xl transition-all duration-200 text-left group"
    onClick={onClick}
  >
    <div className={`w-14 h-14 ${colorClass} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
      <span className="material-symbols-outlined text-3xl">{icon}</span>
    </div>
    <h4 className="text-lg font-bold text-on-surface mb-2">{title}</h4>
    <p className="text-sm text-on-surface-variant leading-relaxed">{desc}</p>
  </button>
);