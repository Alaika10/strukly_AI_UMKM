import { useState, useEffect } from 'react';
import { api } from '../services/api';

const TaxCalculator = () => {
  // State untuk menyimpan nominal omset
  const [omset, setOmset] = useState(50000000);
  const [estimatedTax, setEstimatedTax] = useState(250000);
  const [loading, setLoading] = useState(false);

  // Fungsi untuk memformat angka menjadi format ribuan (Rupiah)
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID").format(number);
  };

  // Fungsi untuk menangani perubahan input
  const handleOmsetChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setOmset(Number(rawValue));
  };

  // Panggil API hitung pajak di backend dengan debounce 500ms
  useEffect(() => {
    const fetchTaxCalculation = async () => {
      if (omset <= 0) {
        setEstimatedTax(0);
        return;
      }
      
      setLoading(true);
      try {
        const query = `?omset=${omset}`;
        const data = await api.dashboard.getTax(query);
        if (data && data.estimated_tax !== undefined) {
          setEstimatedTax(data.estimated_tax);
        } else {
          setEstimatedTax(omset * 0.005);
        }
      } catch (err) {
        console.error("Gagal mendapatkan estimasi pajak dari backend:", err);
        // Fallback jika API gagal
        setEstimatedTax(omset * 0.005);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchTaxCalculation();
    }, 500);

    return () => clearTimeout(timer);
  }, [omset]);

  // Data riwayat (dummy)
  const taxHistory = [
    { id: 1, monthCode: 'SEP', monthName: 'Sept 2023', omset: 45000000, tax: 225000 },
    { id: 2, monthCode: 'AGU', monthName: 'Agu 2023', omset: 52300000, tax: 261500 },
    { id: 3, monthCode: 'JUL', monthName: 'Jul 2023', omset: 38000000, tax: 190000 },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Form & Calculation */}
        <div className="lg:col-span-7 space-y-8">
          {/* Header Editorial */}
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">Pajak Final 0.5%</span>
            <h3 className="text-4xl font-extrabold tracking-tight text-on-surface">Estimasi Kewajiban Pajak Anda</h3>
            <p className="text-on-surface-variant text-lg max-w-lg">
              Gunakan kalkulator simpel ini untuk menghitung setoran PPh Final UMKM (PP No. 23/2018) berdasarkan peredaran bruto bulanan Anda.
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
            <label className="block text-sm font-semibold text-on-surface-variant mb-3 uppercase tracking-wider" htmlFor="omset">
              Total Omset Bulanan (Rp)
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-on-surface-variant font-bold text-2xl">Rp</span>
              </div>
              <input 
                id="omset" 
                type="text" 
                value={omset === 0 ? '' : formatRupiah(omset)}
                onChange={handleOmsetChange}
                placeholder="0" 
                className="block w-full pl-16 pr-12 py-5 bg-surface-container-highest border-none rounded-lg text-3xl font-extrabold text-on-surface focus:ring-4 focus:ring-primary/20 transition-all outline-none animate-pulse-slow" 
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                {loading ? (
                  <span className="material-symbols-outlined text-primary animate-spin">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-primary-container">edit</span>
                )}
              </div>
            </div>
            <p className="mt-4 text-sm text-on-surface-variant/80 italic">
              Masukkan total pendapatan kotor usaha Anda sebelum dikurangi biaya operasional.
            </p>
          </div>

          {/* Result Card (Highlighted) */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-container p-1 rounded-xl shadow-xl">
            <div className="bg-surface-container-lowest/5 backdrop-blur-sm p-8 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="space-y-1 text-center md:text-left">
                <p className="text-on-primary-container/80 text-xs font-bold uppercase tracking-[0.15em]">Estimasi PPh Final (0.5%)</p>
                <div className="flex items-baseline gap-2 text-white">
                  <span className="text-2xl font-bold opacity-80">Rp</span>
                  <span className="text-5xl font-extrabold tracking-tighter">
                    {formatRupiah(estimatedTax)}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary-fixed-dim/20 rounded-full blur-3xl z-0"></div>
          </div>
        </div>

        {/* Right: Information & Tips */}
        <div className="lg:col-span-5 space-y-6">
          {/* Info Card 1 */}
          <div className="bg-surface-container-low p-6 rounded-xl space-y-4">
            <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-secondary-container">verified_user</span>
            </div>
            <h4 className="font-bold text-lg text-on-surface">Siapa yang wajib membayar?</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Sesuai aturan PP 23/2018, pelaku UMKM dengan omset di bawah <b>Rp 4,8 Miliar per tahun</b> berhak menggunakan tarif PPh Final 0,5%.
            </p>
          </div>

          {/* Info Card 2 - Visual */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <div className="h-32 bg-slate-200">
              <img alt="Accounting" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop" />
            </div>
            <div className="p-6 space-y-2">
              <h4 className="font-bold text-on-surface">Batas Bebas Pajak</h4>
              <p className="text-sm text-on-surface-variant">Untuk Wajib Pajak Orang Pribadi, omset sampai dengan <b>Rp 500 juta per tahun</b> tidak dikenakan pajak.</p>
              <div className="pt-4 flex items-center justify-between">
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full" style={{ width: '45%' }}></div>
                </div>
                <span className="text-[10px] font-bold text-secondary ml-3 whitespace-nowrap">45% Kuota</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom: Recent Tax Records */}
      <section className="mt-16 space-y-6">
        <div className="flex items-end justify-between px-2">
          <h4 className="text-2xl font-extrabold tracking-tight">Riwayat Catatan Pajak</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {taxHistory.map((item) => (
            <div key={item.id} className="bg-surface-container-lowest p-6 rounded-xl flex items-center justify-between group hover:bg-surface-container-low transition-colors duration-200 cursor-pointer border border-outline-variant/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary-container">
                  <span className="font-bold text-sm">{item.monthCode}</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">{item.monthName}</p>
                  <p className="font-bold text-on-surface">Rp {formatRupiah(item.omset)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-on-surface-variant uppercase">Pajak</p>
                <p className="text-secondary font-bold text-lg">Rp {formatRupiah(item.tax)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TaxCalculator;