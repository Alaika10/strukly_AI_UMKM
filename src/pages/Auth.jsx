import { useState } from 'react';

const Auth = ({ onLogin }) => {
  // State untuk berpindah antara tampilan Login dan Register
  const [isLoginView, setIsLoginView] = useState(true);
  
  // State untuk data form (dummy)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');

  // Fungsi simulasi submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Di sini untuk memasukkan logika API (fetch/axios) oleh mas yaya
    if (email && password) {
      onLogin();
    } else {
      alert("Mohon isi email dan password terlebih dahulu untuk simulasi.");
    }
  };

  return (
    <div className="min-h-screen flex text-on-surface bg-surface">
      {/* Kiri: Area Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
            </div>
            <div>
              <h2 className="text-xl font-black text-primary leading-none">Precision MSME</h2>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">Financial Architect</p>
            </div>
          </div>

          {/* Judul & Deskripsi */}
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            {isLoginView ? 'Selamat Datang Kembali!' : 'Mulai Perjalanan Anda'}
          </h1>
          <p className="text-on-surface-variant mb-8">
            {isLoginView 
              ? 'Masukkan kredensial Anda untuk mengakses pusat kendali usaha.' 
              : 'Daftarkan bisnis Anda dan nikmati kemudahan manajemen keuangan otomatis.'}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLoginView && (
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Nama Bisnis</label>
                <input 
                  type="text" required 
                  value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Contoh: Kopi Senja Utama" 
                  className="w-full bg-surface-container-low border-none rounded-xl px-5 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email</label>
              <input 
                type="email" required 
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="pemilik@bisnis.id" 
                className="w-full bg-surface-container-low border-none rounded-xl px-5 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Kata Sandi</label>
                {isLoginView && (
                  <a href="#" className="text-xs font-bold text-primary hover:underline">Lupa Sandi?</a>
                )}
              </div>
              <input 
                type="password" required 
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-surface-container-low border-none rounded-xl px-5 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
              />
            </div>

            <button type="submit" className="w-full py-4 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-container transition-colors shadow-lg shadow-primary/20 mt-4 active:scale-[0.98]">
              {isLoginView ? 'Masuk ke Dashboard' : 'Daftar Sekarang'}
            </button>
          </form>

          {/* Toggle View */}
          <div className="mt-10 text-center text-sm text-on-surface-variant">
            {isLoginView ? 'Belum punya akun? ' : 'Sudah mendaftarkan bisnis? '}
            <button 
              onClick={() => setIsLoginView(!isLoginView)} 
              className="font-bold text-primary hover:underline"
            >
              {isLoginView ? 'Daftar di sini' : 'Masuk di sini'}
            </button>
          </div>
        </div>
      </div>

      {/* Kanan: Visual / Artwork (Hanya tampil di layar besar) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center p-12 overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-container/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
        
        {/* Konten Kanan */}
        <div className="relative z-10 max-w-lg text-on-primary">
          <div className="mb-8">
            <span className="material-symbols-outlined text-6xl opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_graph
            </span>
          </div>
          <h2 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Pantau Bisnis Anda <br/>Lebih Presisi.
          </h2>
          <p className="text-lg opacity-80 leading-relaxed mb-10">
            Dari pencatatan harian hingga laporan pajak, Precision MSME menggunakan AI untuk memastikan keuangan usaha Anda selalu rapi dan akurat tanpa repot.
          </p>
          
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-fit">
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://ui-avatars.com/api/?name=Budi&background=fff&color=003d9b" alt="User" />
              <img className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://ui-avatars.com/api/?name=Siti&background=8af5be&color=005235" alt="User" />
              <img className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://ui-avatars.com/api/?name=Andi&background=dae2ff&color=003d9b" alt="User" />
            </div>
            <p className="text-sm font-medium">Dipercaya oleh <span className="font-bold">10.000+</span> UMKM Indonesia.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;