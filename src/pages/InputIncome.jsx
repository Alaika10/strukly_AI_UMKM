import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const INCOME_CATEGORIES = {
  'Makanan Berat': 1,
  'Minuman Sejuk': 2,
  'Camilan / Side Dish': 3,
  'Paket Katering': 4
};

const InputIncome = ({ refreshTransactions }) => {
  const navigate = useNavigate();
  const [source, setSource] = useState('langsung');
  const [amount, setAmount] = useState('');
  const [categoryName, setCategoryName] = useState('Makanan Berat');
  const [saving, setSaving] = useState(false);

  // User Profile dari localStorage
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const displayName = savedUser.business_name || savedUser.name || 'Warung Mantap';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert("Masukkan nominal pemasukan yang valid!");
      return;
    }

    setSaving(true);
    try {
      const categoryId = INCOME_CATEGORIES[categoryName] || 1;
      const merchant = `Pemasukan - ${source === 'langsung' ? 'Langsung' : 'Online'}`;
      const transactionDate = new Date().toISOString().split('T')[0];

      await api.transactions.createManual({
        amount: Number(amount),
        category_id: categoryId,
        merchant,
        transaction_date: transactionDate,
        type: 'income'
      });

      alert("Pemasukan berhasil dicatat!");
      if (refreshTransactions) refreshTransactions();
      navigate('/');
    } catch (err) {
      alert(err.message || "Gagal menyimpan pemasukan.");
    } finally {
      setSaving(false);
    }
  };

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
                <p className="text-sm font-bold text-on-surface">{displayName}</p>
                <p className="text-xs text-on-surface-variant">Pemilik Usaha</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Bento Layout for Form and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Input Form Card */}
        <section className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Nominal Input Section */}
            <div className="space-y-4">
              <label className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase">Nominal Pemasukan</label>
              <div className="relative flex items-center">
                <span className="absolute left-6 text-3xl font-bold text-primary opacity-50">Rp</span>
                <input 
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-surface-container-highest border-none rounded-xl py-8 pl-20 pr-8 text-5xl font-extrabold text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-surface-variant animate-pulse-slow outline-none" 
                  placeholder="0" 
                  type="number"
                />
              </div>
            </div>

            {/* Source Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase">Sumber Pesanan</label>
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setSource('langsung')}
                    className={`flex-1 py-4 px-4 rounded-xl font-bold text-sm flex flex-col items-center gap-2 border-2 transition-all active:scale-95 ${
                      source === 'langsung' ? 'bg-primary text-on-primary border-transparent' : 'bg-surface-container-low text-on-surface-variant border-transparent hover:border-outline-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: source === 'langsung' ? "'FILL' 1" : "" }}>storefront</span>
                    Langsung
                  </button>
                  <button 
                    type="button"
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
                <select 
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full bg-surface-container-highest border-none rounded-xl py-6 px-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20 cursor-pointer outline-none appearance-none"
                >
                  <option>Makanan Berat</option>
                  <option>Minuman Sejuk</option>
                  <option>Camilan / Side Dish</option>
                  <option>Paket Katering</option>
                </select>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={saving}
                className="w-full py-5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-extrabold text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">save</span>
                {saving ? 'Menyimpan...' : 'Simpan Pemasukan'}
              </button>
            </div>
          </form>
        </section>

        {/* Quick Tips/Visual Card */}
        <section className="lg:col-span-4 space-y-6">
          <div className="relative overflow-hidden rounded-xl bg-emerald-50 border border-emerald-100 p-6 min-h-[180px] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200/20 rounded-full -mr-12 -mt-12 blur-2xl"></div>
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-emerald-900 mb-2">Tips Pembukuan</h3>
              <p className="text-sm text-emerald-800/80 leading-relaxed font-medium">Melakukan pencatatan harian secara disiplin membantu mengidentifikasi menu mana yang paling laris setiap bulannya.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InputIncome;