import { useState } from "react";

const TaxCalculator = () => {
    // =========================
    // STATE
    // =========================
    const [omset, setOmset] = useState(0);

    const [estimatedTax, setEstimatedTax] = useState(0);

    // =========================
    // FORMAT RUPIAH
    // =========================
    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID").format(Number(number) || 0);
    };

    // =========================
    // HANDLE INPUT
    // =========================
    const handleOmsetChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, "");

        const parsedValue = Number(rawValue) || 0;

        setOmset(parsedValue);

        // kalkulasi lokal sementara
        setEstimatedTax(parsedValue * 0.005);
    };

    // =========================
    // HISTORY KOSONG DULU
    // =========================
    const taxHistory = [];

    return (
        <div className="p-8 lg:p-12 max-w-6xl mx-auto">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT */}
                <div className="lg:col-span-7 space-y-8">
                    {/* HEADER */}
                    <div className="space-y-2">
                        <span className="text-xs font-bold tracking-widest text-primary uppercase">
                            Pajak Final 0.5%
                        </span>

                        <h3 className="text-4xl font-extrabold tracking-tight text-on-surface">
                            Estimasi Kewajiban Pajak Anda
                        </h3>

                        <p className="text-on-surface-variant text-lg max-w-lg">
                            Kalkulator estimasi PPh Final UMKM.
                        </p>
                    </div>

                    {/* INPUT */}
                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
                        <label
                            className="block text-sm font-semibold text-on-surface-variant mb-3 uppercase tracking-wider"
                            htmlFor="omset"
                        >
                            Total Omset Bulanan (Rp)
                        </label>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-on-surface-variant font-bold text-2xl">
                                    Rp
                                </span>
                            </div>

                            <input
                                id="omset"
                                type="text"
                                value={omset === 0 ? "" : formatRupiah(omset)}
                                onChange={handleOmsetChange}
                                placeholder="0"
                                className="block w-full pl-16 pr-12 py-5 bg-surface-container-highest border-none rounded-lg text-3xl font-extrabold text-on-surface focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                            />
                        </div>

                        <p className="mt-4 text-sm text-on-surface-variant/80 italic">
                            Masukkan total pendapatan kotor usaha Anda.
                        </p>
                    </div>

                    {/* RESULT */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-container p-1 rounded-xl shadow-xl">
                        <div className="bg-surface-container-lowest/5 backdrop-blur-sm p-8 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                            <div className="space-y-1 text-center md:text-left">
                                <p className="text-on-primary-container/80 text-xs font-bold uppercase tracking-[0.15em]">
                                    Estimasi PPh Final (0.5%)
                                </p>

                                <div className="flex items-baseline gap-2 text-white">
                                    <span className="text-2xl font-bold opacity-80">
                                        Rp
                                    </span>

                                    <span className="text-5xl font-extrabold tracking-tighter">
                                        {formatRupiah(estimatedTax)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-surface-container-low p-6 rounded-xl space-y-4">
                        <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-secondary-container">
                                verified_user
                            </span>
                        </div>

                        <h4 className="font-bold text-lg text-on-surface">
                            Informasi Pajak UMKM
                        </h4>

                        <p className="text-sm text-on-surface-variant leading-relaxed">
                            UMKM dengan omset di bawah Rp 4,8 miliar per tahun
                            dapat menggunakan tarif PPh Final 0,5%.
                        </p>
                    </div>
                </div>
            </section>

            {/* HISTORY */}
            <section className="mt-16 space-y-6">
                <div className="flex items-end justify-between px-2">
                    <h4 className="text-2xl font-extrabold tracking-tight">
                        Riwayat Catatan Pajak
                    </h4>
                </div>

                {taxHistory.length === 0 ? (
                    <div className="bg-surface-container-lowest p-8 rounded-xl text-center text-on-surface-variant">
                        Belum ada data riwayat pajak.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {taxHistory.map((item) => (
                            <div
                                key={item.id}
                                className="bg-surface-container-lowest p-6 rounded-xl"
                            >
                                {item.monthName}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default TaxCalculator;
