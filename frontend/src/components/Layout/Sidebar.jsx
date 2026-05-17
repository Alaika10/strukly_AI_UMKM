import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ onLogout, isMobileOpen, onCloseMobile, currentUser }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuItems = [
    { icon: 'dashboard', label: 'Beranda', path: '/' },
    { icon: 'add_chart', label: 'Catat Pemasukan', path: '/input-income' },
    { icon: 'shopping_cart', label: 'Catat Pengeluaran', path: '/input-expense' },
    { icon: 'calculate', label: 'Hitung Pajak', path: '/tax' },
    { icon: 'history', label: 'Riwayat', path: '/history' },
  ];

  // Load profile dari localStorage
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const businessName = currentUser?.business_name || currentUser?.name || savedUser.business_name || savedUser.name || 'Warung Berkah';
  const email = currentUser?.email || savedUser.email || 'pemilik@bisnis.id';

  return (
    <>
      {/* --- BACKGROUND OVERLAY (Hanya di Mobile saat menu terbuka) --- */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCloseMobile}
      />

      {/* --- SIDEBAR CONTAINER --- */}
      <aside className={`h-screen w-64 fixed left-0 top-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col border-r border-outline-variant/10 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* --- HEADER SIDEBAR (Logo) --- */}
        <div className="h-16 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#003d9b] rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-blue-900/20">
              <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                receipt_long
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-xl font-black text-[#003d9b] leading-none tracking-tight">Strukly</h2>
              <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 mt-1">For UMKM</p>
            </div>
          </div>
          
          <button 
            onClick={onCloseMobile}
            className="md:hidden material-symbols-outlined text-slate-400 hover:text-slate-800 transition-colors"
          >
            close
          </button>
        </div>
        
        {/* --- Area Menu Navigasi Utama --- */}
        <div className="flex flex-col space-y-1 px-4 mt-6">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) => `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ease-out ${
                isActive 
                ? 'text-blue-700 dark:text-blue-400 font-bold border-r-4 border-blue-700 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {({ isActive }) => (
                <>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}>
                    {item.icon}
                  </span>
                  <span className="font-body text-sm font-medium tracking-wide">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
        
        {/* Spacer untuk mendorong menu bawah ke paling bawah layar */}
        <div className="flex-grow"></div>

        {/* Dynamic Business Profile Card */}
        <div className="px-4 py-3 mb-2 mx-4 bg-surface-container-low dark:bg-slate-900 rounded-2xl flex items-center gap-3 border border-outline-variant/10">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
            <img 
              alt="Profil Bisnis" 
              className="w-full h-full object-cover" 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(businessName)}&background=dae2ff&color=003d9b`} 
            />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{businessName}</p>
            <p className="text-[10px] text-slate-500 truncate">{email}</p>
          </div>
        </div>
        
        {/* --- Bagian Menu Bawah --- */}
        <div className="px-4 pb-4">
          <div className="flex flex-col space-y-1 border-t border-outline-variant/10 pt-4">
            
            <NavLink 
              to="/settings"
              onClick={onCloseMobile}
              className={({ isActive }) => `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ease-out ${
                isActive 
                ? 'text-blue-700 dark:text-blue-400 font-bold border-r-4 border-blue-700 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {({ isActive }) => (
                <>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}>
                    settings
                  </span>
                  <span className="font-body text-sm font-medium tracking-wide">Pengaturan</span>
                </>
              )}
            </NavLink>

            {/* Tombol Keluar memicu Modal */}
            <button 
              onClick={() => setIsLogoutModalOpen(true)} 
              className="flex items-center gap-3 py-3 px-4 w-full text-slate-500 hover:text-error dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all duration-200 ease-out group text-left cursor-pointer"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="font-body text-sm font-medium tracking-wide">Keluar</span>
            </button>
            
          </div>
        </div>
      </aside>

      {/* --- MODAL KONFIRMASI LOGOUT --- */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          
          <div 
            className="absolute inset-0" 
            onClick={() => setIsLogoutModalOpen(false)}
          ></div>

          {/* Kotak Modal Utama */}
          <div className="bg-surface-container-lowest w-full max-w-md mx-4 p-8 rounded-[2rem] shadow-2xl border border-outline-variant/10 animate-in fade-in zoom-in-95 duration-200 relative z-10">
            <div className="flex flex-col items-center text-center">
              
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-error text-3xl ml-1">logout</span>
              </div>
              
              <h3 className="text-2xl font-bold text-on-surface mb-2 font-headline tracking-tight">Yakin ingin keluar?</h3>
              <p className="text-on-surface-variant mb-8 leading-relaxed text-sm">
                Pastikan semua pekerjaan Anda telah tersimpan sebelum meninggalkan sesi ini.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button 
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 px-6 py-3.5 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors font-headline" 
                >
                  Batal
                </button>
                
                <button 
                  onClick={() => {
                    setIsLogoutModalOpen(false);
                    onCloseMobile();
                    onLogout();
                  }}
                  className="flex-1 bg-primary text-on-primary px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all font-headline"
                >
                  Keluar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;