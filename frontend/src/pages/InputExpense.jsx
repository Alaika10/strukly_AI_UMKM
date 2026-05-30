import { useState, useRef } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import EditTransactionModal from '../components/EditTransactionModal';

const EXPENSE_CATEGORIES_MAPPING = {
  'Logistik': 5,
  'Operasional': 6,
  'Peralatan': 8,
  'Pajak': 9
};

const InputExpense = ({ transactions = [], refreshTransactions }) => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // State untuk form manual
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryName, setCategoryName] = useState('Logistik');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Loading state
  const [loadingManual, setLoadingManual] = useState(false);
  const [loadingOCR, setLoadingOCR] = useState(false);

  // State untuk edit & delete
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

  // Fungsi memicu jendela file explorer / kamera HP
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Fungsi memproses berkas yang masuk via OCR AI
  const handleFileProcess = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Format berkas tidak didukung. Silakan unggah berkas gambar struk (JPG/PNG)!");
      return;
    }

    setLoadingOCR(true);
    try {
      await api.transactions.createFromOCR(file);
      alert("Smart Scan AI Berhasil! Transaksi otomatis dideteksi dan dicatat ke sistem.");
      if (refreshTransactions) refreshTransactions();
      navigate('/');
    } catch (err) {
      alert(err.message || "Gagal melakukan scan OCR AI. Silakan masukkan data secara manual.");
    } finally {
      setLoadingOCR(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileProcess(file);
  };

  // Handler untuk Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileProcess(file);
  };

  // Handler simpan manual
  const handleSaveManual = async (e) => {
    e.preventDefault();
    if (!vendor) {
      alert("Masukkan nama vendor atau toko!");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert("Masukkan nominal pengeluaran yang valid!");
      return;
    }

    setLoadingManual(true);
    try {
      const categoryId = EXPENSE_CATEGORIES_MAPPING[categoryName] || 5;

      await api.transactions.createManual({
        amount: Number(amount),
        category_id: categoryId,
        merchant: vendor,
        transaction_date: date,
        type: 'expense'
      });

      alert("Pengeluaran berhasil dicatat!");
      if (refreshTransactions) refreshTransactions();
      navigate('/');
    } catch (err) {
      alert(err.message || "Gagal mencatat pengeluaran.");
    } finally {
      setLoadingManual(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 relative z-0 overflow-hidden">
      {/* Visual Polish: Soft Ambient Glow */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-5%] left-[20%] w-[300px] h-[300px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      {/* INPUT FILE TERSEMBUNYI (Mendukung Kamera HP & File Explorer PC) */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="flex-1">
          <h3 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">Automasi Pengeluaran</h3>
          <p className="text-on-surface-variant max-w-md leading-relaxed">
            Gunakan teknologi vision AI kami untuk mengekstrak data dari struk belanja secara otomatis atau masukkan detail secara manual untuk kontrol penuh.
          </p>
        </div>
      </div>

      {/* Interaction Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        {/* Smart Scan Section */}
        <div 
          className="lg:col-span-7 group"
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={`h-full min-h-[350px] bg-surface-container-lowest rounded-xl p-8 transition-all duration-300 hover:shadow-lg border-2 border-dashed ${
            isDragging ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/40'
          } flex flex-col items-center justify-center text-center relative overflow-hidden cursor-pointer`}>
            
            {loadingOCR && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-4 z-20">
                <span className="material-symbols-outlined text-5xl text-[#003d9b] animate-spin">sync</span>
                <p className="text-base font-bold text-[#003d9b]">Vision AI Strukly sedang membaca struk Anda...</p>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center mb-6 relative z-10">
              <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
            </div>
            <h4 className="text-xl font-bold mb-2 relative z-10">Smart Scan AI</h4>
            <p className="text-on-surface-variant mb-6 max-w-xs mx-auto relative z-10 text-sm">
              {isDragging ? "Lepaskan berkas struk di sini..." : "Tarik dan lepas struk belanja Anda di sini, atau klik untuk memilih file dari perangkat."}
            </p>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleUploadClick();
              }}
              className="relative z-10 bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-3 rounded-lg font-medium shadow-md hover:scale-[0.98] transition-transform cursor-pointer"
            >
              Unggah Struk Sekarang
            </button>
            <div className="mt-8 flex gap-4 items-center relative z-10">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs text-on-secondary-container">auto_awesome</span>
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-tertiary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs text-on-tertiary-fixed">bolt</span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-primary uppercase tracking-widest">AI sedang bersiap merapikan data Anda</span>
            </div>
          </div>
        </div>

        {/* Manual Input Section */}
        <div className="lg:col-span-5">
          <div className="h-full bg-surface-container-low rounded-xl p-8">
            <h4 className="text-lg font-bold mb-6">Input Manual</h4>
            <form className="space-y-5" onSubmit={handleSaveManual}>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Nama Vendor / Toko</label>
                <input 
                  required
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                  placeholder="Contoh: Toko Berkah Jaya" 
                  type="text" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Nominal (IDR)</label>
                  <input 
                    required
                    value={amount ? new Intl.NumberFormat("id-ID").format(amount) : ''}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\./g, '');
                      if (rawValue === '' || (Number(rawValue) >= 0 && !isNaN(rawValue))) {
                        setAmount(rawValue);
                      }
                    }}
                    className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                    placeholder="0" 
                    type="text" 
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Kategori</label>
                  <div className="relative">
                    <select 
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option>Logistik</option>
                      <option>Operasional</option>
                      <option>Peralatan</option>
                      <option>Pajak</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-sm">keyboard_arrow_down</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Tanggal Transaksi</label>
                <input 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none cursor-pointer" 
                  type="date" 
                />
              </div>
              <button 
                type="submit" 
                disabled={loadingManual}
                className="w-full py-4 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingManual ? 'Menyimpan...' : 'Simpan Pengeluaran'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Recent History Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-on-surface">Riwayat Pengeluaran Terbaru</h3>
          <Link to="/history" state={{ filterType: 'out' }} className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            Lihat Semua <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Waktu</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Vendor</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Kategori</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Status AI</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Nominal</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.filter(t => t.type === 'out').slice(0, 3).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900 block">{item.date.split(',')[1]?.trim() || item.date.split(',')[0]}</span>
                      <span className="text-xs text-slate-500">{item.date.split(',')[0]}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block">{item.title || item.vendor}</span>
                      <span className="text-xs text-slate-500">{item.refId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md inline-block">{item.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 w-fit ${item.aiStatus?.includes('AI') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {item.aiStatus?.includes('AI') && <span className="material-symbols-outlined text-[12px]">auto_awesome</span>}
                        {!item.aiStatus?.includes('AI') && <span className="material-symbols-outlined text-[12px]">history</span>}
                        {item.aiStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-extrabold text-red-600">
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
                {transactions.filter(t => t.type === 'out').length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400 font-medium">
                      Belum ada riwayat pengeluaran.
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

export default InputExpense;