import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const Navbar = ({ onMenuClick, currentUser }) => {
  // State untuk Notifikasi
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // State untuk Dynamic Alerts
  const [activeAlerts, setActiveAlerts] = useState([]);

  // State untuk Menu Profil
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Load profile dari localStorage
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const businessName = currentUser?.business_name || currentUser?.name || savedUser.business_name || savedUser.name || 'Warung Berkah';
  const email = currentUser?.email || savedUser.email || 'pemilik@bisnis.id';

  const loadNotificationsAndAlerts = async () => {
    try {
      // Ambil notifikasi
      const notifData = await api.notifications.getAll();
      if (Array.isArray(notifData)) {
        setNotifications(notifData);
        setUnreadCount(notifData.filter(n => !n.is_read && n.status !== 'read').length);
      }

      // Ambil alert dinamis
      const alertData = await api.alerts.getAll();
      if (Array.isArray(alertData)) {
        setActiveAlerts(alertData);
      }
    } catch (err) {
      console.error("Gagal memuat notifikasi/alerts:", err);
    }
  };

  useEffect(() => {
    loadNotificationsAndAlerts();
    // Refresh setiap 10 detik agar terasa real-time
    const interval = setInterval(loadNotificationsAndAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Mencegah scroll saat notifikasi terbuka & menutup dropdown profil jika klik di luar
  useEffect(() => {
    if (isNotificationOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

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

  // Handler Tandai Satu Notifikasi Dibaca
  const handleMarkAsRead = async (id) => {
    try {
      await api.notifications.markAsRead(id);
      loadNotificationsAndAlerts();
    } catch (err) {
      console.error("Gagal menandai notifikasi dibaca:", err);
    }
  };

  // Handler Tandai Semua Dibaca
  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifs = notifications.filter(n => !n.is_read && n.status !== 'read');
      await Promise.all(unreadNotifs.map(n => api.notifications.markAsRead(n.id)));
      loadNotificationsAndAlerts();
    } catch (err) {
      console.error("Gagal menandai semua notifikasi dibaca:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Helper Pemetaan Icon Notifikasi
  const getNotificationIcon = (title = '', message = '') => {
    const text = (title + ' ' + message).toLowerCase();
    if (text.includes('sandi') || text.includes('keamanan') || text.includes('password')) {
      return { icon: 'lock_reset', bg: 'bg-red-50 text-red-600' };
    }
    if (text.includes('omset') || text.includes('kas') || text.includes('pemasukan') || text.includes('positif')) {
      return { icon: 'trending_up', bg: 'bg-green-50 text-green-600' };
    }
    if (text.includes('pajak') || text.includes('pph') || text.includes('kewajiban')) {
      return { icon: 'account_balance', bg: 'bg-blue-50 text-blue-600' };
    }
    return { icon: 'celebration', bg: 'bg-purple-50 text-purple-600' };
  };

  return (
    <>
      {/* --- TOP NAVBAR --- */}
      <nav className="fixed top-0 w-full z-40 bg-surface/80 dark:bg-slate-900/80 backdrop-blur-md flex flex-col justify-center px-4 md:px-8 h-16 max-w-full border-b border-outline-variant/10">
        <div className="flex justify-between items-center w-full">
          {/* Bagian Kiri: Tombol Menu (Mobile) & Brand */}
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={onMenuClick}
              className="material-symbols-outlined p-2 md:hidden text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              menu
            </button>

            <span className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 truncate max-w-[160px] sm:max-w-none">
              {businessName}
            </span>
          </div>
          
          {/* Bagian Kanan: Menu Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2 md:gap-4">
              
              {/* Tombol Lonceng (Notifikasi) */}
              <div className="relative group cursor-pointer">
                <button 
                  onClick={() => setIsNotificationOpen(true)}
                  className="material-symbols-outlined p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-full relative"
                >
                  notifications
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface animate-ping-slow"></span>
                  )}
                </button>
              </div>

            </div>
            
            <div className="hidden sm:block h-8 w-[1px] bg-outline-variant/30"></div>
            
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
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(businessName)}&background=dae2ff&color=003d9b`} 
                />
              </div>

              {/* Dropdown Profil */}
              {isProfileOpen && (
                <div className="absolute top-12 right-0 w-60 bg-white dark:bg-slate-900 border border-outline-variant/20 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  {/* Header Profil */}
                  <div className="px-5 py-4 border-b border-outline-variant/10">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{businessName}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{email}</p>
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
                      state={{ activeTab: 'akun' }}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl text-slate-400">settings</span>
                      Pengaturan Akun
                    </Link>
                  </div>
                  
                  <div className="border-t border-outline-variant/10 pt-2 pb-1">
                    <button 
                      onClick={handleLogout}
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
        </div>
      </nav>

      {/* --- BANNER ALERT DINAMIS (Jika Ada Alert Aktif) --- */}
      {activeAlerts.length > 0 && (
        <div className="fixed top-16 left-0 right-0 z-30 bg-amber-500 text-white py-2 px-4 text-center text-xs font-bold shadow-md flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
          <span className="material-symbols-outlined text-sm">warning</span>
          <span>{activeAlerts[0].message || activeAlerts[0]}</span>
        </div>
      )}

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
        <div className="p-6 flex justify-between items-center mt-safe border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h4 className="font-headline font-extrabold text-xl text-slate-900 tracking-tight">Notifikasi</h4>
            {unreadCount > 0 && (
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold">{unreadCount} Baru</span>
            )}
          </div>
          <button 
            onClick={() => setIsNotificationOpen(false)}
            className="material-symbols-outlined p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors"
          >
            close
          </button>
        </div>

        {/* Konten Notifikasi */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-2 pb-6 divide-y divide-slate-50">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-3">
              <span className="material-symbols-outlined text-5xl">notifications_off</span>
              <p className="text-sm font-medium">Belum ada notifikasi untuk Anda.</p>
            </div>
          ) : (
            notifications.map((item) => {
              const { icon, bg } = getNotificationIcon(item.title, item.message);
              const isUnread = !item.is_read && item.status !== 'read';
              return (
                <div 
                  key={item.id} 
                  onClick={() => handleMarkAsRead(item.id)}
                  className={`p-4 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer rounded-2xl group ${
                    isUnread ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${bg}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm leading-tight mb-1 ${isUnread ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>{item.title || 'Pemberitahuan'}</p>
                    <p className="text-xs text-slate-500 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: item.message }}></p>
                    <p className="text-[10px] font-medium text-slate-400">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Baru saja'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Panel */}
        <div className="p-6 bg-white pb-safe border-t border-slate-100">
          <button 
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="w-full py-4 rounded-xl border-2 border-primary/20 text-primary font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tandai semua sudah dibaca
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;