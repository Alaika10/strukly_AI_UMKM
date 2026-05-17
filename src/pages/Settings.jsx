import { useState, useEffect } from 'react'; 
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';

const Settings = ({ currentUser, onUpdateUser }) => {
  const location = useLocation();
  
  // Langsung set nilai awal berdasarkan location.state
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profil');

  // State untuk form Profil Bisnis
  const [businessName, setBusinessName] = useState(currentUser?.business_name || currentUser?.name || 'Kopi Senja Utama');
  const [category, setCategory] = useState(currentUser?.business_category || 'f&b');
  const [logoUrl, setLogoUrl] = useState(currentUser?.logo_url || '');

  // State untuk form Akun & Keamanan
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // --- STATE NOTIFIKASI ---
  const [notifyTax, setNotifyTax] = useState(true);
  const [notifyDailyCashflow, setNotifyDailyCashflow] = useState(true);
  const [notifySecurity, setNotifySecurity] = useState(true);
  const [notifySystem, setNotifySystem] = useState(true);

  const [loading, setLoading] = useState(false);

  // Ambil profil bisnis terbaru saat mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await api.settings.getProfile();
        if (profile) {
          setBusinessName(profile.business_name || profile.name || '');
          setCategory(profile.business_category || 'f&b');
          setLogoUrl(profile.logo_url || '');
          setIs2FAEnabled(!!profile.two_factor_enabled);
          
          // Set preferences
          setNotifyTax(profile.notif_tax_reminder !== false);
          setNotifyDailyCashflow(profile.notif_daily_summary !== false);
          setNotifySecurity(profile.notif_monthly_report !== false);
          setNotifySystem(profile.notif_stock_reminder !== false);

          if (onUpdateUser) {
            onUpdateUser({ ...currentUser, ...profile });
          }
        }
      } catch (err) {
        console.error("Gagal memuat profil bisnis:", err);
      }
    };
    loadProfile();
  }, []);

  // Handler Simpan Profil Bisnis
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!businessName) {
      alert("Nama bisnis tidak boleh kosong!");
      return;
    }

    setLoading(true);
    try {
      const updated = await api.settings.updateProfile({
        name: currentUser?.name || 'MSME User',
        business_name: businessName,
        business_category: category,
        logo_url: logoUrl
      });
      
      alert(updated.message || "Profil bisnis berhasil disimpan!");
      
      // Update local storage & global user state
      const newUserObj = { ...currentUser, ...updated.user };
      localStorage.setItem('user', JSON.stringify(newUserObj));
      if (onUpdateUser) onUpdateUser(newUserObj);
    } catch (err) {
      alert(err.message || "Gagal menyimpan profil bisnis.");
    } finally {
      setLoading(false);
    }
  };

  // Handler Simpan Keamanan
  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert("Konfirmasi kata sandi baru tidak cocok!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        two_factor_enabled: is2FAEnabled
      };
      if (currentPassword && newPassword) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }

      const res = await api.settings.updateSecurity(payload);
      alert(res.message || "Pengaturan keamanan berhasil diperbarui!");
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      alert(err.message || "Gagal memperbarui kata sandi.");
    } finally {
      setLoading(false);
    }
  };

  // Handler Ganti Switch Notifikasi secara otomatis
  const handleToggleNotification = async (type, checked) => {
    let nextTax = notifyTax;
    let nextDaily = notifyDailyCashflow;
    let nextSecurity = notifySecurity;
    let nextSystem = notifySystem;

    if (type === 'tax') {
      setNotifyTax(checked);
      nextTax = checked;
    } else if (type === 'daily') {
      setNotifyDailyCashflow(checked);
      nextDaily = checked;
    } else if (type === 'security') {
      setNotifySecurity(checked);
      nextSecurity = checked;
    } else if (type === 'system') {
      setNotifySystem(checked);
      nextSystem = checked;
    }

    try {
      await api.settings.updateNotifications({
        notif_stock_reminder: nextSystem,
        notif_daily_summary: nextDaily,
        notif_tax_reminder: nextTax,
        notif_monthly_report: nextSecurity
      });
    } catch (err) {
      console.error("Gagal menyimpan preferensi notifikasi:", err);
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">Pengaturan</h1>
        <p className="text-on-surface-variant text-lg font-medium opacity-80">Kelola identitas bisnis Anda</p>
      </header>

      {/* HORIZONTAL TAB NAVIGATION */}
      <nav className="flex gap-8 border-b border-outline-variant/30 mb-8 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('profil')}
          className={`px-1 py-4 text-sm whitespace-nowrap transition-colors ${
            activeTab === 'profil' 
            ? 'font-bold text-primary border-b-2 border-primary' 
            : 'font-medium text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Profil Bisnis
        </button>
        <button 
          onClick={() => setActiveTab('akun')}
          className={`px-1 py-4 text-sm whitespace-nowrap transition-colors ${
            activeTab === 'akun' 
            ? 'font-bold text-primary border-b-2 border-primary' 
            : 'font-medium text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Akun & Keamanan
        </button>
        <button 
          onClick={() => setActiveTab('notifikasi')}
          className={`px-1 py-4 text-sm whitespace-nowrap transition-colors ${
            activeTab === 'notifikasi' 
            ? 'font-bold text-primary border-b-2 border-primary' 
            : 'font-medium text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Notifikasi
        </button>
      </nav>

      {/* Settings Content Area */}
      <div className="mb-12 min-h-[400px]">
          
        {/* --- KONTEN TAB: PROFIL BISNIS --- */}
        {activeTab === 'profil' && (
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl shadow-sm overflow-hidden p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="md:col-span-4">
                <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-6">Logo Bisnis</h3>
                <div className="flex flex-col items-center md:items-start">
                  <div className="w-40 h-40 rounded-3xl bg-surface-container border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-2 group hover:border-primary transition-colors cursor-pointer mb-6">
                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-4xl">add_photo_alternate</span>
                    <span className="text-xs font-bold text-outline group-hover:text-primary transition-colors">Unggah Logo</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed text-center md:text-left">
                    Gunakan file JPG, PNG, atau SVG.<br />Maksimal ukuran file 2MB.
                  </p>
                </div>
              </div>
              <div className="md:col-span-8">
                <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-6">Informasi Utama</h3>
                <form className="space-y-6" onSubmit={handleSaveProfile}>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="business-name">Nama Bisnis</label>
                    <input 
                      id="business-name" type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Contoh: Kopi Senja Utama" 
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="business-category">Kategori Bisnis</label>
                    <div className="relative">
                      <select 
                        id="business-category" value={category} onChange={(e) => setCategory(e.target.value)}
                        className="bg-none w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option value="f&b">Makanan & Minuman</option>
                        <option value="retail">Retail / Warung Kelontong</option>
                        <option value="service">Jasa</option>
                        <option value="fashion">Fashion & Kecantikan</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">keyboard_arrow_down</span>
                    </div>
                  </div>
                  <div className="pt-6 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
                      {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* --- KONTEN TAB: AKUN & KEAMANAN --- */}
        {activeTab === 'akun' && (
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl shadow-sm overflow-hidden p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-3xl mx-auto space-y-10">
              <div>
                <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Alamat Email</h3>
                <div className="flex flex-col">
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5" htmlFor="email">Email Utama</label>
                  <input 
                    id="email" type="email" value={currentUser?.email || 'pemilik.bisnis@example.id'} readOnly 
                    className="w-full bg-surface-container-high/50 border-none rounded-xl px-4 py-3.5 text-on-surface-variant cursor-not-allowed outline-none" 
                  />
                  <p className="mt-2 text-xs text-on-surface-variant">Email ini digunakan untuk login dan korespondensi resmi.</p>
                </div>
              </div>
              <div className="h-px bg-outline-variant/10"></div>
              
              <form onSubmit={handleSaveSecurity}>
                <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-6">Ganti Kata Sandi</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="current-password">Kata Sandi Saat Ini</label>
                    <input 
                      id="current-password" type="password" placeholder="••••••••" 
                      value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="new-password">Kata Sandi Baru</label>
                      <input 
                        id="new-password" type="password" placeholder="••••••••" 
                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="confirm-password">Konfirmasi Kata Sandi Baru</label>
                      <input 
                        id="confirm-password" type="password" placeholder="••••••••" 
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                      />
                    </div>
                  </div>
                </div>
                <div className="h-px bg-outline-variant/10 my-10"></div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-grow">
                    <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest mb-1">Autentikasi Dua Faktor (2FA)</h3>
                    <p className="text-sm text-on-surface-variant">Tingkatkan keamanan akun Anda dengan verifikasi tambahan saat login.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" className="sr-only peer" 
                      checked={is2FAEnabled} onChange={() => setIs2FAEnabled(!is2FAEnabled)} 
                    />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="pt-10 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                    {loading ? 'Menyimpan...' : 'Simpan Perubahan Keamanan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- KONTEN TAB: NOTIFIKASI --- */}
        {activeTab === 'notifikasi' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Section 1: Keuangan & Pajak */}
            <div>
              <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.15em] mb-6">NOTIFIKASI KEUANGAN & PAJAK</h3>
              <div className="space-y-4">
                
                {/* Toggle Pajak */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 flex items-center justify-between shadow-sm border border-outline-variant/10">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-primary-fixed/30 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-2xl">account_balance</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-base">Peringatan Pembayaran Pajak</h4>
                      <p className="text-sm text-on-surface-variant">Alert otomatis saat saldo mencukupi untuk bayar PPh Final.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={notifyTax} onChange={(e) => handleToggleNotification('tax', e.target.checked)} />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Toggle Harian */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 flex items-center justify-between shadow-sm border border-outline-variant/10">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-primary-fixed/30 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-2xl">trending_up</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-base">Ringkasan Arus Kas Harian</h4>
                      <p className="text-sm text-on-surface-variant">Laporan harian komparasi total pemasukan vs pengeluaran.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={notifyDailyCashflow} onChange={(e) => handleToggleNotification('daily', e.target.checked)} />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Section 2: Akun & Keamanan */}
            <div>
              <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.15em] mb-6">NOTIFIKASI AKUN & SISTEM</h3>
              <div className="space-y-4">
                
                {/* Toggle Security */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 flex items-center justify-between shadow-sm border border-outline-variant/10">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-secondary-container/50 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-2xl">lock_reset</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-base">Aktivitas Keamanan</h4>
                      <p className="text-sm text-on-surface-variant">Pemberitahuan perubahan kata sandi atau upaya login baru.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={notifySecurity} onChange={(e) => handleToggleNotification('security', e.target.checked)} />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Toggle Sistem */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 flex items-center justify-between shadow-sm border border-outline-variant/10">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-secondary-container/50 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-2xl">celebration</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-base">Info & Pembaruan Sistem</h4>
                      <p className="text-sm text-on-surface-variant">Pesan selamat datang, pengumuman, dan fitur baru.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={notifySystem} onChange={(e) => handleToggleNotification('system', e.target.checked)} />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {/* Tips Bisnis Card */}
        <div className="bg-[#8af5be] p-8 rounded-[2rem] relative overflow-hidden flex flex-col justify-between aspect-square md:aspect-auto h-full min-h-[250px]">
          <div className="relative z-10">
            <div className="bg-[#005235]/10 inline-block px-3 py-1 rounded-full mb-6">
              <span className="text-[10px] font-bold text-[#005235] uppercase tracking-wider">TIPS BISNIS</span>
            </div>
            <h4 className="text-2xl font-bold text-[#005235] mb-4 leading-tight">Optimalkan Pajak Restoran</h4>
            <p className="text-sm text-[#005235] opacity-80 leading-relaxed mb-6 max-w-[240px]">
              Gunakan sistem klasifikasi pengeluaran otomatis untuk mempermudah pelaporan pajak bulanan Anda.
            </p>
          </div>
          <a className="text-[#005235] font-bold text-sm flex items-center gap-2 group z-10 w-fit" href="#">
            Baca selengkapnya 
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </a>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 border-[16px] border-[#005235]/5 rounded-full"></div>
        </div>

        {/* Support Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-sm p-8 rounded-[2rem] flex flex-col justify-between h-full min-h-[250px]">
          <div>
            <h4 className="text-2xl font-bold text-on-surface mb-3">Butuh bantuan pengaturan?</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
              Tim dukungan kami siap membantu konfigurasi notifikasi yang tepat untuk kebutuhan UMKM Anda.
            </p>
          </div>
          <div className="flex justify-start">
            <button className="bg-primary text-on-primary px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
              Hubungi Support
              <span className="material-symbols-outlined text-lg">chat_bubble</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Settings;