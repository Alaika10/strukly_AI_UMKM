import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Tambahkan props onMenuClick 
const Navbar = ({ onMenuClick }) => {
  // State untuk Notifikasi
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  // State untuk Menu Profil
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Mencegah scroll saat notifikasi terbuka & menutup dropdown profil jika klik di luar
  useEffect(() => {
    // Kunci scroll jika notifikasi terbuka
    if (isNotificationOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Fungsi deteksi klik di luar profil
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => { 
      document.body.style.overflow = 'unset'; 
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  return (
    <>
      {/* --- TOP NAVBAR --- */}
      <nav className="fixed top-0 w-full z-40 bg-surface/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center px-4 md:px-8 h-16 max-w-full border-b border-outline-variant/10">
        
        {/* Bagian Kiri: Tombol Menu (Mobile) & Brand */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={onMenuClick}
            className="material-symbols-outlined p-2 md:hidden text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            menu
          </button>

          <span className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 truncate max-w-[160px] sm:max-w-none">
            Wirausaha Mandiri
          </span>
        </div>
        
        {/* Bagian Kanan: Menu Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Tombol Lonceng (Notifikasi) */}
            <div className="relative group cursor-pointer">
              <button 
                onClick={() => setIsNotificationOpen(true)}
                className="material-symbols-outlined p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-full"
              >
                notifications
              </button>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </div>

          </div>
          
          <div className="hidden sm:block h-8 w-[1px] bg-outline-variant/30"></div>
          
          <button className="hidden sm:block font-headline text-sm font-medium text-blue-700 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors">
            Bantuan
          </button>
          
          {/* --- MENU PROFIL --- */}
          <div className="relative" ref={profileRef}>
            {/* Tombol Profil (Gambar) */}
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden border border-slate-200 cursor-pointer shrink-0 hover:ring-2 hover:ring-primary/30 transition-all"
            >
              <img 
                alt="Profil Pengguna" 
                className="w-full h-full object-cover" 
                src="https://ui-avatars.com/api/?name=Warung+Berkah&background=dae2ff&color=003d9b" 
              />
            </div>

            {/* Dropdown Profil */}
            {isProfileOpen && (
              <div className="absolute top-12 right-0 w-60 bg-white dark:bg-slate-900 border border-outline-variant/20 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                {/* Header Profil */}
                <div className="px-5 py-4 border-b border-outline-variant/10">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Warung Berkah</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">pemilik@example.id</p>
                </div>
                
                {/* List Menu Profil */}
                <div className="py-2">
                  <Link 
                    to="/settings"
                    state={{ activeTab: 'profil' }}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl text-slate-400">person</span>
                    Profil Bisnis
                  </Link>
                  <Link 
                    to="/settings"
                    state={{ activeTab: 'akun' }} Tambahkan state ini
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl text-slate-400">settings</span>
                    Pengaturan Akun
                  </Link>
                  <a 
                    href="#"
                    className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl text-slate-400">help</span>
                    Pusat Bantuan
                  </a>
                </div>
                
                <div className="border-t border-outline-variant/10 pt-2 pb-1">
                  <button 
                    // Nanti bisa disesuaikan untuk memanggil modal logout
                    onClick={() => {
                      setIsProfileOpen(false);
                      // Logika logout bisa ditaruh di sini
                    }}
                    className="flex w-full items-center gap-3 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">logout</span>
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* --- AKHIR MENU PROFIL --- */}

        </div>
      </nav>

      {/* --- SIDE DRAWER NOTIFIKASI --- */}
      
      {/* Backdrop Overlay Notifikasi */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isNotificationOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsNotificationOpen(false)}
      />

      {/* Panel Drawer Notifikasi */}
      <div 
        className={`fixed top-0 right-0 h-screen w-full sm:w-[400px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out flex flex-col ${
          isNotificationOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header Panel */}
        <div className="p-6 flex justify-between items-center mt-safe">
          <div className="flex items-center gap-3">
            <h4 className="font-headline font-extrabold text-xl text-slate-900 tracking-tight">Notifikasi</h4>
            <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold">3 Baru</span>
          </div>
          {/* Tombol Tutup (X) */}
          <button 
            onClick={() => setIsNotificationOpen(false)}
            className="material-symbols-outlined p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors"
          >
            close
          </button>
        </div>

        {/* Konten Notifikasi */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-2 pb-6">
          
          {/* Item 1: Perubahan Kata Sandi (Merah) */}
          <div className="p-4 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer rounded-2xl group">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lock_reset</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 leading-tight mb-1">Kata Sandi Diubah</p>
              <p className="text-xs text-slate-500 leading-relaxed mb-2">Kata sandi akun Anda berhasil diperbarui. Hubungi bantuan jika ini bukan Anda.</p>
              <p className="text-[11px] font-semibold text-blue-700">Baru saja</p>
            </div>
          </div>
          
          {/* Item 2: Ringkasan Omset Harian (Hijau) */}
          <div className="p-4 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer rounded-2xl group">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 leading-tight mb-1">Ringkasan Harian Positif!</p>
              <p className="text-xs text-slate-500 leading-relaxed mb-2">Hebat! Pemasukan hari ini lebih besar <b>Rp 250.000</b> dibandingkan pengeluaran.</p>
              <p className="text-[11px] font-medium text-slate-400">2 jam yang lalu</p>
            </div>
          </div>
          
          {/* Item 3: Pengingat Pajak (Biru) */}
          <div className="p-4 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer rounded-2xl group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100/50 flex items-center justify-center text-blue-600 shrink-0">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 leading-tight mb-1">Wajib Bayar Pajak</p>
              <p className="text-xs text-slate-500 leading-relaxed mb-2">Sisa saldo Anda sudah mencukupi. Segera lunasi tagihan PPh Final bulan ini.</p>
              <p className="text-[11px] font-medium text-slate-400">1 hari yang lalu</p>
            </div>
          </div>

          {/* Item 4: Sambutan Pengguna Baru (Ungu) */}
          <div className="p-4 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer rounded-2xl group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>celebration</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 leading-tight mb-1">Selamat Datang di Sistem!</p>
              <p className="text-xs text-slate-500 leading-relaxed mb-2">Akun Anda berhasil terdaftar ke database. Mari mulai kelola keuangan bisnis Anda.</p>
              <p className="text-[11px] font-medium text-slate-400">2 hari yang lalu</p>
            </div>
          </div>

        </div>

        {/* Footer Panel */}
        <div className="p-6 bg-white pb-safe">
          <button className="w-full py-4 rounded-xl border-2 border-primary/20 text-primary font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
            Tandai semua sudah dibaca
          </button>
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 sm:hidden"></div>
        </div>
      </div>
    </>
  );
};

export default Navbar;