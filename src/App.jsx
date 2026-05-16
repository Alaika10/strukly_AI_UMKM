import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';

import Auth from './pages/Auth';
import Home from './pages/Home';
import InputIncome from './pages/InputIncome';
import InputExpense from './pages/InputExpense';
import TaxCalculator from './pages/TaxCalculator';
import Settings from './pages/Settings';
import History from './pages/History';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // STATE BARU: Untuk mengontrol Sidebar di tampilan Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [transactions, setTransactions] = useState([
    { id: 1, title: "Penjualan Paket Sembako", refId: "Nota #TRX-00921", type: "in", date: "24 Okt 2023, 14:20", amount: 450000 },
    { id: 2, title: "Restock Beras Cianjur", refId: "Pembelian Grosir", type: "out", date: "24 Okt 2023, 10:15", amount: 1200000 },
  ]);

  const handleAddFakeTransaction = () => {
    const newTransaction = {
      id: Date.now(),
      title: "Penjualan Baru (Simulasi)",
      refId: "Nota #TRX-SIM" + Math.floor(Math.random() * 100),
      type: "in",
      date: new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      amount: 150000 + Math.floor(Math.random() * 500000),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <BrowserRouter>
      {/* Kirim fungsi buka menu ke Navbar */}
      <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
      
      {/* Kirim state dan fungsi tutup ke Sidebar */}
      <Sidebar 
        onLogout={() => setIsAuthenticated(false)} 
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <main className="md:ml-64 pt-20 min-h-screen bg-slate-50/50 transition-all duration-300">
        <Routes>
          <Route path="/" element={<Home transactions={transactions} onAddFakeTransaction={handleAddFakeTransaction} />} />
          <Route path="/input-income" element={<InputIncome />} />
          <Route path="/input-expense" element={<InputExpense />} />
          <Route path="/tax" element={<TaxCalculator />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;