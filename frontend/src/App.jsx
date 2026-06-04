import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { api } from "./services/api";

import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import InputIncome from "./pages/InputIncome";
import InputExpense from "./pages/InputExpense";
import TaxCalculator from "./pages/TaxCalculator";
import Settings from "./pages/Settings";
import History from "./pages/History";

// (Categories now fetched dynamically via API and returned as category_name by backend)

const formatTransactionDate = (dateStr, createdDateStr) => {
    try {
        const d = new Date(dateStr);
        const c = createdDateStr ? new Date(createdDateStr) : d;

        if (isNaN(d.getTime())) return dateStr;

        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mei",
            "Jun",
            "Jul",
            "Agu",
            "Sep",
            "Okt",
            "Nov",
            "Des",
        ];

        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear();

        const hours = String(c.getHours()).padStart(2, "0");
        const minutes = String(c.getMinutes()).padStart(2, "0");

        return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
    } catch (e) {
        return dateStr;
    }
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token"),
    );

    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem("user");
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error("Gagal parse user dari localStorage:", error);
            localStorage.removeItem("user");
            return null;
        }
    });

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [transactions, setTransactions] = useState([]);

    const [loadingTransactions, setLoadingTransactions] = useState(false);

    const loadTransactions = async () => {
        if (!isAuthenticated) return;

        setLoadingTransactions(true);

        try {
            const rawData = await api.transactions.getAll();

            const mappedData = rawData.map((t) => ({
                id: t.id,

                title:
                    t.merchant ||
                    (t.type === "income"
                        ? "Pemasukan Manual"
                        : "Pengeluaran Manual"),

                refId: `Nota #TRX-${String(t.id).padStart(5, "0")}`,

                type: t.type === "income" ? "in" : "out",

                date: formatTransactionDate(
                    t.transaction_date || t.createdAt || t.created_at || new Date(),
                    t.createdAt || t.created_at
                ),

                rawDate: new Date(t.transaction_date || t.createdAt || t.created_at || new Date()).toISOString().split("T")[0],

                amount: Number(t.amount),

                category:
                    t.category_name || "Umum",
                    
                rawCategory: t.category_name || "Umum",

                source: t.type === "income" ? "Penjualan Langsung" : undefined,

                vendor:
                    t.type === "expense" ? t.merchant || "Vendor" : undefined,

                aiStatus:
                    t.type === "expense"
                        ? t.source === "ocr"
                            ? "Scan OCR AI"
                            : "Manual Input"
                        : undefined,

                refInfo: t.type === "income" ? "Tunai" : "Struk Belanja",
            }));

            // transaksi terbaru di atas
            setTransactions(mappedData.reverse());
        } catch (err) {
            console.error("Gagal memuat transaksi dari backend:", err);
        } finally {
            setLoadingTransactions(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadTransactions();
        }
    }, [isAuthenticated]);

    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setCurrentUser(null);
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <Auth onLogin={handleLoginSuccess} />;
    }

    return (
        <BrowserRouter>
            <Navbar
                onMenuClick={() => setIsMobileMenuOpen(true)}
                currentUser={currentUser}
            />

            <Sidebar
                onLogout={handleLogout}
                isMobileOpen={isMobileMenuOpen}
                onCloseMobile={() => setIsMobileMenuOpen(false)}
                currentUser={currentUser}
            />

            <main className="md:ml-64 pt-20 min-h-screen bg-slate-50/50 transition-all duration-300">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Home
                                transactions={transactions}
                                refreshTransactions={loadTransactions}
                                loadingTransactions={loadingTransactions}
                            />
                        }
                    />

                    <Route
                        path="/input-income"
                        element={
                            <InputIncome
                                transactions={transactions}
                                refreshTransactions={loadTransactions}
                            />
                        }
                    />

                    <Route
                        path="/input-expense"
                        element={
                            <InputExpense
                                transactions={transactions}
                                refreshTransactions={loadTransactions}
                            />
                        }
                    />

                    <Route path="/tax" element={<TaxCalculator />} />

                    <Route
                        path="/history"
                        element={
                            <History
                                transactions={transactions}
                                refreshTransactions={loadTransactions}
                            />
                        }
                    />

                    <Route
                        path="/settings"
                        element={
                            <Settings
                                currentUser={currentUser}
                                onUpdateUser={setCurrentUser}
                            />
                        }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;
