import { useState } from 'react';
import { Link } from 'react-router-dom';

const InputIncome = () => {
  const [source, setSource] = useState('langsung'); // State untuk tombol sumber pesanan

  return (
    <div className="p-8 lg:p-12">
      {/* Header Section */}
      <header className="mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">Catat Pemasukan</h2>
            <p className="text-on-surface-variant font-body">Halo Juragan! Mari catat setiap rupiah hasil masakan hari ini.</p>
          </div>
          <div className="hidden lg:block">
            <div className="bg-surface-container-low px-6 py-4 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">Warung Mantap</p>
                <p className="text-xs text-on-surface-variant">Admin Keuangan</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Bento Layout for Form and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Input Form Card */}
        <section className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-slate-100">
          <div className="space-y-8">
            {/* Nominal Input Section */}
            <div className="space-y-4">
              <label className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase">Nominal Pemasukan</label>
              <div className="relative flex items-center">
                <span className="absolute left-6 text-3xl font-bold text-primary opacity-50">Rp</span>
                <input 
                  className="w-full bg-surface-container-highest border-none rounded-xl py-8 pl-20 pr-8 text-5xl font-extrabold text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-surface-variant" 
                  placeholder="0" 
                  type="number" // Diubah ke type number agar memunculkan keypad angka di HP
                />
              </div>
            </div>

            {/* Source Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase">Sumber Pesanan</label>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSource('langsung')}
                    className={`flex-1 py-4 px-4 rounded-xl font-bold text-sm flex flex-col items-center gap-2 border-2 transition-all active:scale-95 ${
                      source === 'langsung' ? 'bg-primary text-on-primary border-transparent' : 'bg-surface-container-low text-on-surface-variant border-transparent hover:border-outline-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: source === 'langsung' ? "'FILL' 1" : "" }}>storefront</span>
                    Langsung
                  </button>
                  <button 
                    onClick={() => setSource('online')}
                    className={`flex-1 py-4 px-4 rounded-xl font-bold text-sm flex flex-col items-center gap-2 border-2 transition-all active:scale-95 ${
                      source === 'online' ? 'bg-primary text-on-primary border-transparent' : 'bg-surface-container-low text-on-surface-variant border-transparent hover:border-outline-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: source === 'online' ? "'FILL' 1" : "" }}>smartphone</span>
                    Online
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase">Kategori Menu</label>
                <select className="w-full bg-surface-container-highest border-none rounded-xl py-6 px-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20 cursor-pointer">
                  <option>Makanan Berat</option>
                  <option>Minuman Sejuk</option>
                  <option>Camilan / Side Dish</option>
                  <option>Paket Katering</option>
                </select>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button className="w-full py-5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-extrabold text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95">
                <span className="material-symbols-outlined">save</span>
                Simpan Pemasukan
              </button>
            </div>
          </div>
        </section>

        {/* Quick Tips/Visual Card */}
        <section className="lg:col-span-4 space-y-6">
          <div className="relative overflow-hidden rounded-xl bg-emerald-50 border border-emerald-100 p-6 min-h-[180px] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <span class="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200/20 rounded-full -mr-12 -mt-12 blur-2xl"></div>
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-emerald-900 mb-2">Tips Hari Ini</h3>
              <p className="text-sm text-emerald-800/80 leading-relaxed font-medium">Jangan lupa catat pesanan online segera setelah 'Selesai' agar stok bahan baku tetap akurat!</p>
            </div>
          </div>

          {/* Small Stats Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ringkasan Hari Ini</p>
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  <span className="material-symbols-outlined text-[12px]">trending_up</span>
                  +12%
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-3xl font-black text-slate-900 tracking-tight">Rp 2.450.000</h4>
                <p className="text-[10px] text-slate-400 font-medium">Dibandingkan rata-rata harian</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>Target Harian</span>
                  <span>75%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-blue-400 w-3/4 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* History Table Section */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-xl font-bold text-on-surface">Riwayat Pemasukan Terbaru</h3>
          <Link 
            to="/history" 
            state={{ filterType: 'in' }} 
            className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
          >
            Lihat Semua
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Waktu</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Sumber</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Kategori</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {/* Contoh Data 1 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-on-surface">14:30 WIB</span>
                    <span className="text-xs text-on-surface-variant">Hari Ini</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
                    Penjualan Langsung
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant font-medium">Makanan Berat</td>
                <td className="px-6 py-5 text-right font-extrabold text-on-surface">Rp 125.000</td>
              </tr>
              {/* Contoh Data 2 */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-on-surface">13:15 WIB</span>
                    <span className="text-xs text-on-surface-variant">Hari Ini</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>smartphone</span>
                    Pesanan Online
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant font-medium">Paket Katering</td>
                <td className="px-6 py-5 text-right font-extrabold text-on-surface">Rp 850.000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default InputIncome;