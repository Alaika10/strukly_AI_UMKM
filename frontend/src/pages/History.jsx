import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { api } from '../services/api';
import EditTransactionModal from '../components/EditTransactionModal';

const History = ({ transactions = [], refreshTransactions }) => {
  const location = useLocation();
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

  // State untuk Filter
  const [filterType, setFilterType] = useState(location.state?.filterType || 'all');
  const [filterMonth, setFilterMonth] = useState('all'); 
  const [searchQuery, setSearchQuery] = useState('');

  // --- LOGIKA UNTUK GENERATE OPSI BULAN DAN TAHUN SECARA DINAMIS ---
  const generateMonthOptions = () => {
    const options = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    
    // Kita generate data mundur dari tahun saat ini (2026) hingga tahun awal record (2023)
    const startYear = 2023;
    const currentYear = 2026; 

    for (let year = currentYear; year >= startYear; year--) {
      // Jika tahun berjalan (2026), batasi hanya sampai bulan saat ini (Mei)
      const maxMonth = year === 2026 ? 4 : 11; // 4 = Mei dalam indeks 0-11
      
      for (let monthIdx = maxMonth; monthIdx >= 0; monthIdx--) {
        const label = `${months[monthIdx]} ${year}`; // Hasil: "Mei 2026", "Apr 2026", dst.
        options.push({ value: label, label: label });
      }
    }
    return options;
  };

  const monthOptions = generateMonthOptions();

  // Logika Pemfilteran Data Berlapis (Tipe + Bulan/Tahun + Pencarian)
  const filteredData = transactions.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    
    // Cocokkan teks drop-down (contoh: "Okt 2023") dengan string tanggal item (contoh: "24 Okt 2023, 14:20")
    const matchesMonth = filterMonth === 'all' || item.date.includes(filterMonth);
    
    const searchTarget = `${item.title} ${item.refInfo} ${item.source || ''} ${item.vendor || ''}`.toLowerCase();
    const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());
    
    return matchesType && matchesMonth && matchesSearch;
  });

  // Fungsi Ekspor ke Excel
  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert("Tidak ada data transaksi yang cocok dengan filter saat ini untuk diekspor!");
      return;
    }

    const excelData = filteredData.map((item, index) => ({
      "No": index + 1,
      "Tanggal & Waktu": item.date,
      "Tipe Transaksi": item.type === 'in' ? 'Pemasukan' : 'Pengeluaran',
      "Kategori": item.category,
      "Keterangan / Judul": item.type === 'in' ? item.title : item.vendor,
      "Referensi / Catatan": item.refInfo,
      "Sumber / Status AI": item.type === 'in' ? (item.source || '-') : (item.aiStatus || '-'),
      "Nominal (Rp)": item.type === 'in' ? item.amount : -item.amount
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Transaksi");
    XLSX.writeFile(workbook, `Laporan_Strukly_${filterMonth.replace(' ', '_')}.xlsx`);
  };

  return (
    <div className="p-4 sm:p-8 lg:p-12">
      {/* Header Halaman */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Riwayat Transaksi</h2>
          <p className="text-slate-500 font-medium">Pantau seluruh arus kas masuk dan keluar bisnis Anda.</p>
        </div>
        
        <button 
          onClick={handleExportExcel}
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-50 hover:text-[#003d9b] hover:border-[#003d9b]/30 active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-lg text-emerald-600">table_view</span>
          Ekspor ke Excel
        </button>
      </header>

      {/* Kontrol Tabel */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col lg:flex-row justify-between items-center gap-4">
        
        {/* Tab Filter Tipe */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full lg:w-auto overflow-x-auto no-scrollbar shrink-0">
          <button onClick={() => setFilterType('all')} className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filterType === 'all' ? 'bg-white text-[#003d9b] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Semua</button>
          <button onClick={() => setFilterType('in')} className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filterType === 'in' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Pemasukan</button>
          <button onClick={() => setFilterType('out')} className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filterType === 'out' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Pengeluaran</button>
        </div>

        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
          {/* Dropdown Filter Bulan (Sudah Diperbaiki Menggunakan bg-none dan Ikon Panah Tunggal) */}
          <div className="relative w-full sm:w-52 shrink-0">
            <select 
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="bg-none w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-[#003d9b]/20 outline-none sidebar-icon-toggle appearance-none cursor-pointer transition-all"
            >
              <option value="all">Semua Waktu</option>
              {monthOptions.map((opt, idx) => (
                <option key={idx} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">keyboard_arrow_down</span>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64 shrink-0">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              type="text" 
              placeholder="Cari transaksi..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#003d9b]/20 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

      </div>

      {/* Tabel Riwayat */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 w-40">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Keterangan Transaksi</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Kategori</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Tipe</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Nominal</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm font-semibold text-slate-700">{item.date.split(',')[0]}</span>
                      <span className="block text-xs text-slate-400 mt-0.5">{item.date.split(',')[1]}</span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900">{item.type === 'in' ? item.title : item.vendor}</p>
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1">
                        <p className="text-xs text-slate-500">{item.refInfo}</p>
                        {item.type === 'in' && item.source && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 uppercase tracking-wider">Sumber: {item.source}</span>
                        )}
                        {item.type === 'out' && item.aiStatus && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 ${item.aiStatus.includes('AI') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                            {item.aiStatus.includes('AI') && <span className="material-symbols-outlined text-[12px]">auto_awesome</span>}
                            {item.aiStatus}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md inline-block">{item.category}</span>
                    </td>
                    <td className="px-6 py-5">
                      {item.type === 'in' ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                          <span className="material-symbols-outlined text-[14px]">arrow_downward</span> Pemasukan
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold">
                          <span className="material-symbols-outlined text-[14px]">arrow_upward</span> Pengeluaran
                        </div>
                      )}
                    </td>
                      <td className={`px-6 py-5 text-right font-extrabold whitespace-nowrap ${item.type === 'in' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {item.type === 'in' ? '+' : '-'} Rp {new Intl.NumberFormat("id-ID").format(item.amount)}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <button onClick={() => setEditingItem(item)} className="text-blue-500 hover:text-blue-700 mx-2 p-1 bg-blue-50 rounded" title="Edit">
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded" title="Hapus">
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
                      <p className="font-medium">Tidak ada transaksi yang ditemukan.</p>
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
  );
};

export default History;