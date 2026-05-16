import { useState, useRef } from 'react'; 
import { Link } from 'react-router-dom';

const InputExpense = () => {
  // --- LOGIKA UTUK INTERAKSI SMART SCAN AI ---
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Fungsi memicu jendela file explorer / kamera HP
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Fungsi memproses berkas yang masuk
  const handleFileProcess = (file) => {
    if (file && file.type.startsWith('image/')) {
      alert(`Sip! Berkas struk "${file.name}" berhasil ditangkap.\n\n[Simulasi: Sistem Strukly sedang mengirim gambar ke Backend Utama -> AI Service untuk di-scan OCR...]`);
    } else {
      alert("Format berkas tidak didukung. Silakan unggah berkas gambar struk (JPG/PNG)!");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileProcess(file);
  };

  // Handler untuk Drag & Drop di perangkat komputer
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

  return (
    <div className="p-8 lg:p-12 relative z-0 overflow-hidden">
      {/* Visual Polish: Soft Ambient Glow (Dari desain Anda) */}
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
        <div className="flex items-end">
          <div className="flex bg-surface-container-low p-1.5 rounded-full">
            <button className="px-6 py-2 rounded-full bg-surface-container-lowest shadow-sm text-primary font-semibold text-sm transition-all duration-200">Mode Cerdas</button>
            <button className="px-6 py-2 rounded-full text-on-surface-variant hover:text-on-surface font-medium text-sm transition-all duration-200">Input Manual</button>
          </div>
        </div>
      </div>

      {/* Interaction Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        {/* Smart Scan Section - Ditambahkan trigger klik, drag, drop, dan state border visual */}
        <div 
          className="lg:col-span-7 group"
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={`h-full bg-surface-container-lowest rounded-xl p-8 transition-all duration-300 hover:shadow-lg border-2 border-dashed ${
            isDragging ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/40'
          } flex flex-col items-center justify-center text-center relative overflow-hidden cursor-pointer`}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center mb-6 relative z-10">
              <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
            </div>
            <h4 className="text-xl font-bold mb-2 relative z-10">Smart Scan AI</h4>
            <p className="text-on-surface-variant mb-6 max-w-xs mx-auto relative z-10 text-sm">
              {isDragging ? "Lepaskan berkas struk di sini..." : "Tarik dan lepas struk belanja Anda di sini, atau klik untuk memilih file dari perangkat."}
            </p>
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Mencegah bubbling double click ke parent div
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
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Nama Vendor / Toko</label>
                <input className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Contoh: Toko Berkah Jaya" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Nominal (IDR)</label>
                  <input className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="0" type="number" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Kategori</label>
                  <select className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer">
                    <option>Logistik</option>
                    <option>Operasional</option>
                    <option>Peralatan</option>
                    <option>Pajak</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Tanggal Transaksi</label>
                <input className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none cursor-pointer" type="date" />
              </div>
              <button className="w-full py-3 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-container transition-colors mt-2" type="button">
                Simpan Pengeluaran
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Table Section (Riwayat Pengeluaran) */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-xl font-bold text-on-surface">Riwayat Pengeluaran Terbaru</h3>
          <Link 
            to="/history" 
            state={{ filterType: 'out' }}
            className="text-[#003d9b] text-sm font-bold flex items-center gap-1 hover:underline transition-all"
          >
            Lihat Semua
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-slate-100">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/50">
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Tanggal</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Vendor</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Kategori</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Status AI</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Nominal</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant/30">
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-5 text-sm font-medium">12 Okt 2023</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface">IndoMarket Express</span>
                      <span className="text-xs text-on-surface-variant">Struk #IM-9921</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider">Logistik</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-secondary">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className="text-xs font-semibold">Verified by AI</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-on-surface">Rp 1.250.000</td>
                  <td className="px-6 py-5 text-right">
                    <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-surface-container-highest rounded transition-all">
                      <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-5 text-sm font-medium">11 Okt 2023</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface">PLN Persero</span>
                      <span className="text-xs text-on-surface-variant">Listrik Kantor</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold uppercase tracking-wider">Operasional</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">history</span>
                      <span className="text-xs font-semibold">Manual Input</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-on-surface">Rp 842.200</td>
                  <td className="px-6 py-5 text-right">
                    <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-surface-container-highest rounded transition-all">
                      <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-5 text-sm font-medium">10 Okt 2023</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface">Office Depot Central</span>
                      <span className="text-xs text-on-surface-variant">Struk #OD-1102</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full bg-outline-variant/30 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">Peralatan</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-secondary">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className="text-xs font-semibold">Verified by AI</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-on-surface">Rp 3.120.000</td>
                  <td className="px-6 py-5 text-right">
                    <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-surface-container-highest rounded transition-all">
                      <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InputExpense;