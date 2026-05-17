import { useState, useRef } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const EXPENSE_CATEGORIES_MAPPING = {
  'Logistik': 5,
  'Operasional': 6,
  'Peralatan': 8,
  'Pajak': 9
};

const InputExpense = ({ refreshTransactions }) => {
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
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                    placeholder="0" 
                    type="number" 
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
    </div>
  );
};

export default InputExpense;