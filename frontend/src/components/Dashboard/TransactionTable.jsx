import { useState } from 'react';
import { Link } from 'react-router-dom';

// Menerima data (props) transactions dari App.jsx / Home.jsx
const TransactionTable = ({ transactions = [] }) => {
  
  // State untuk mengontrol batas jumlah data yang tampil (default awal: 2 baris)
  const [limit, setLimit] = useState(2);

  // Fungsi pembantu untuk memformat angka menjadi format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Potong data dari array props sesuai dengan limit yang sedang aktif
  const visibleTransactions = transactions.slice(0, limit);

  // Fungsi untuk mengubah limit saat tombol di bawah tabel diklik
  const handleToggleLimit = () => {
    if (limit === 2) {
      setLimit(transactions.length); // Buka seluruh data
    } else {
      setLimit(2); // Kembalikan ke tampilan ringkas (2 data)
    }
  };

  return (
    <section className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span className="w-2 h-6 bg-primary rounded-full"></span>
          Transaksi Terbaru
        </h3>
        
        <Link 
          to="/history" 
          state={{ filterType: 'all' }} // Kirim state 'all' agar di Riwayat menampilkan semua
          className="text-primary text-sm font-bold flex items-center gap-1 hover:underline transition-all"
        >
          Lihat Semua
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
      
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-surface-container-high">
              <tr>
                <th className="px-8 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Keterangan Transaksi</th>
                <th className="px-8 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Kategori</th>
                <th className="px-8 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Tanggal</th>
                <th className="px-8 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {/* Kita me-loop menggunakan 'visibleTransactions' yang sudah dipotong */}
              {visibleTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        trx.type === 'in' ? 'bg-secondary-container/20 text-secondary' : 'bg-error-container/20 text-error'
                      }`}>
                        <span className="material-symbols-outlined text-xl">
                          {trx.type === 'in' ? 'arrow_downward' : 'arrow_upward'}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{trx.title}</p>
                        <p className="text-xs text-on-surface-variant">{trx.refId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                      trx.type === 'in' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'
                    }`}>
                      {trx.type === 'in' ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-on-surface-variant">{trx.date}</td>
                  <td className={`px-8 py-5 text-right font-bold text-lg ${
                    trx.type === 'in' ? 'text-secondary' : 'text-error'
                  }`}>
                    {trx.type === 'in' ? '+' : '-'} {formatRupiah(trx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Jika data dari backend murni kosong, tampilkan pesan */}
        {transactions.length === 0 && (
          <div className="p-8 text-center text-slate-500">Belum ada transaksi.</div>
        )}
        
        {/* Tombol Tampilkan Lebih Banyak / Sedikit hanya muncul jika total data lebih dari 2 */}
        {transactions.length > 2 && (
          <div className="p-4 bg-surface-container-low text-center border-t border-outline-variant/5">
            <button 
              onClick={handleToggleLimit}
              className="text-xs font-bold text-on-surface-variant flex items-center gap-2 mx-auto hover:text-primary transition-all cursor-pointer"
            >
              {limit === 2 ? (
                <>
                  Tampilkan Lebih Banyak
                  <span className="material-symbols-outlined text-sm transition-transform duration-300">expand_more</span>
                </>
              ) : (
                <>
                  Tampilkan Lebih Sedikit
                  <span className="material-symbols-outlined text-sm rotate-180 transition-transform duration-300">expand_more</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TransactionTable;