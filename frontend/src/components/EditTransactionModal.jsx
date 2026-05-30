import { useState, useEffect } from 'react';
import { api } from '../services/api';

const EditTransactionModal = ({ isOpen, onClose, transaction, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category_id: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (transaction) {
      setFormData({
        title: transaction.type === 'in' ? transaction.title : transaction.vendor,
        amount: transaction.amount,
        category_id: transaction.category_id || '',
        date: transaction.rawDate || new Date().toISOString().split('T')[0]
      });
      
      const fetchCategories = async () => {
        try {
          const type = transaction.type === 'in' ? 'income' : 'expense';
          const data = await api.categories.getAll(type);
          setCategories(data);
          if (!transaction.category_id && data.length > 0) {
            setFormData(prev => ({ ...prev, category_id: data[0].id }));
          }
        } catch (err) {
          console.error("Failed to fetch categories", err);
        }
      };
      fetchCategories();
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.transactions.update(transaction.id, {
        merchant: formData.title,
        amount: Number(formData.amount),
        category_id: Number(formData.category_id),
        transaction_date: formData.date,
        type: transaction.type === 'in' ? 'income' : 'expense'
      });
      alert('Transaksi berhasil diubah!');
      onSave(); // Refresh data and close modal
      onClose();
    } catch (err) {
      alert(err.message || 'Gagal mengubah transaksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-extrabold text-slate-800">Edit Transaksi</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Keterangan / Judul</label>
            <input 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-slate-50 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" 
              type="text" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nominal (Rp)</label>
            <input 
              required
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full bg-slate-50 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" 
              type="number"
              min="0" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kategori</label>
            <select 
              required
              value={formData.category_id}
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              className="w-full bg-slate-50 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none cursor-pointer" 
            >
              <option value="" disabled>Pilih Kategori</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tanggal</label>
            <input 
              required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full bg-slate-50 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" 
              type="date" 
            />
          </div>
          
          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
