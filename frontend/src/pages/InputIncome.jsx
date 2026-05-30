import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import EditTransactionModal from '../components/EditTransactionModal';

// Categories fetched dynamically

const InputIncome = ({ transactions = [], refreshTransactions }) => {
  const navigate = useNavigate();
  const [source, setSource] = useState('langsung');
  const [amount, setAmount] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.categories.getAll('income');
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
      } catch (err) {
        console.error("Failed to load income categories");
      }
    };
    fetchCategories();
  }, []);
  const [editingItem, setEditingItem] = useState(null);

  const handleDelete = async (id) => {
    if(window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
       try {
           await api.transactions.delete(id);
           if(refreshTransactions) refreshTransactions();
       } catch (err) {
           alert(err.message || "Gagal menghapus transaksi.");
       }
    }
  }

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
      const category_id = Number(categoryId) || categories[0]?.id || 6;
      const merchant = `Pemasukan - ${source === 'langsung' ? 'Langsung' : 'Online'}`;
      const transactionDate = new Date().toISOString().split('T')[0];

      await api.transactions.createManual({
        amount: Number(amount),
        category_id: category_id,
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
                  value={amount ? new Intl.NumberFormat("id-ID").format(amount) : ''}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\./g, '');
                    if (rawValue === '' || (Number(rawValue) >= 0 && !isNaN(rawValue))) {
                      setAmount(rawValue);
                    }
                  }}
                  className="w-full bg-surface-container-highest border-none rounded-xl py-8 pl-20 pr-8 text-5xl font-extrabold text-on-surface focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-surface-variant animate-pulse-slow outline-none" 
                  placeholder="0" 
                  type="text"
                  inputMode="numeric"
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
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-surface-container-highest border-none rounded-xl py-6 px-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20 cursor-pointer outline-none appearance-none"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                  {categories.length === 0 && <option value="">Loading...</option>}
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

      {/* Recent History Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-on-surface">Riwayat Pemasukan Terbaru</h3>
          <Link to="/history" state={{ filterType: 'in' }} className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            Lihat Semua <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Waktu</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Sumber</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Kategori</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Nominal</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.filter(t => t.type === 'in').slice(0, 3).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900 block">{item.date.split(',')[1]?.trim() || item.date.split(',')[0]}</span>
                      <span className="text-xs text-slate-500">{item.date.split(',')[0]}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[14px]">storefront</span>
                        {item.title || item.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-700">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-extrabold text-emerald-600">
                      Rp {new Intl.NumberFormat("id-ID").format(item.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button onClick={() => setEditingItem(item)} className="text-blue-500 hover:text-blue-700 mx-2 p-1 bg-blue-50 rounded" title="Edit">
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded" title="Hapus">
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {transactions.filter(t => t.type === 'in').length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-400 font-medium">
                      Belum ada riwayat pemasukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Modal Edit */}
        <EditTransactionModal 
          isOpen={!!editingItem} 
          transaction={editingItem} 
          onClose={() => setEditingItem(null)}
          onSave={() => {
            if (refreshTransactions) refreshTransactions();
          }}
        />
      </div>
    </div>
  );
};

export default InputIncome;