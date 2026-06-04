import random
import uuid
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
from faker import Faker

from sdv.evaluation.single_table import evaluate_quality
from sdv.metadata import Metadata
from sdv.single_table import CTGANSynthesizer

# =========================================================
# CONFIG
# =========================================================

TARGET_ROWS = 2000  
SYNTHETIC_ROWS = 10000  

START_DATE = datetime(2024, 1, 1)
END_DATE = datetime(2025, 12, 31)

random.seed(42)
np.random.seed(42)

fake = Faker("id_ID")

# =========================================================
# MASTER ITEM TABLE
# =========================================================

MASTER_ITEMS = {
    "Nasi Goreng": {"kategori": "Makanan & Bahan Makanan", "tipe": "pemasukan", "base_price": 25000},
    "Mie Ayam": {"kategori": "Makanan & Bahan Makanan", "tipe": "pemasukan", "base_price": 18000},
    "Bakso": {"kategori": "Makanan & Bahan Makanan", "tipe": "pemasukan", "base_price": 22000},
    "Ayam Geprek": {"kategori": "Makanan & Bahan Makanan", "tipe": "pemasukan", "base_price": 24000},
    "Soto Ayam": {"kategori": "Makanan & Bahan Makanan", "tipe": "pemasukan", "base_price": 20000},
    
    "Es Teh": {"kategori": "Minuman & Bahan Minuman", "tipe": "pemasukan", "base_price": 8000},
    "Kopi Susu": {"kategori": "Minuman & Bahan Minuman", "tipe": "pemasukan", "base_price": 18000},
    "Jeruk Es": {"kategori": "Minuman & Bahan Minuman", "tipe": "pemasukan", "base_price": 10000},
    "Matcha Latte": {"kategori": "Minuman & Bahan Minuman", "tipe": "pemasukan", "base_price": 22000},

    "Beras": {"kategori": "Makanan & Bahan Makanan", "tipe": "pengeluaran", "base_price": 180000},
    "Daging Ayam": {"kategori": "Makanan & Bahan Makanan", "tipe": "pengeluaran", "base_price": 250000},
    "Cabai": {"kategori": "Makanan & Bahan Makanan", "tipe": "pengeluaran", "base_price": 90000},
    "Minyak Goreng": {"kategori": "Makanan & Bahan Makanan", "tipe": "pengeluaran", "base_price": 150000},
    "Gas LPG": {"kategori": "Makanan & Bahan Makanan", "tipe": "pengeluaran", "base_price": 220000},

    "Teh": {"kategori": "Minuman & Bahan Minuman", "tipe": "pengeluaran", "base_price": 75000},
    "Kopi": {"kategori": "Minuman & Bahan Minuman", "tipe": "pengeluaran", "base_price": 120000},
    "Susu": {"kategori": "Minuman & Bahan Minuman", "tipe": "pengeluaran", "base_price": 110000},
    "Cup Plastik": {"kategori": "Minuman & Bahan Minuman", "tipe": "pengeluaran", "base_price": 50000},

    # ITEM ASET (Pembelian Sangat Jarang)
    "Pembelian Blender": {"kategori": "Perlengkapan Operasional", "tipe": "pengeluaran", "base_price": 450000},
    "Perbaikan Kompor": {"kategori": "Perlengkapan Operasional", "tipe": "pengeluaran", "base_price": 350000},
    "Pembelian Meja": {"kategori": "Perlengkapan Operasional", "tipe": "pengeluaran", "base_price": 700000},
    "Seragam Karyawan": {"kategori": "Fashion", "tipe": "pengeluaran", "base_price": 300000},

    "Pulpen": {"kategori": "ATK/Administrasi", "tipe": "pengeluaran", "base_price": 15000},
    "Tinta Printer": {"kategori": "ATK/Administrasi", "tipe": "pengeluaran", "base_price": 120000},
    "Kertas Nota": {"kategori": "ATK/Administrasi", "tipe": "pengeluaran", "base_price": 50000},

    "Masker": {"kategori": "Kesehatan", "tipe": "pengeluaran", "base_price": 30000},
    "Vitamin": {"kategori": "Kesehatan", "tipe": "pengeluaran", "base_price": 85000},
    "Apron": {"kategori": "Fashion", "tipe": "pengeluaran", "base_price": 90000},
}

ITEM_NAMES = list(MASTER_ITEMS.keys())

# Daftar item yang harus dibatasi frekuensinya (Aset Jangka Panjang)
ASSET_ITEMS = ["Pembelian Blender", "Perbaikan Kompor", "Pembelian Meja", "Seragam Karyawan"]
# Komoditas cepat habis (untuk substitusi jika aset terkena pembatasan)
CONSUMABLE_ITEMS = ["Beras", "Daging Ayam", "Cabai", "Minyak Goreng", "Teh", "Kopi", "Susu", "Cup Plastik"]

# =========================================================
# HELPER FUNCTIONS
# =========================================================

def random_date(start: datetime, end: datetime) -> datetime:
    delta = end - start
    return start + timedelta(seconds=random.randint(0, int(delta.total_seconds())))

def calculate_nominal(item_name: str, date: datetime) -> tuple:
    item_meta = MASTER_ITEMS[item_name]
    tipe = item_meta["tipe"]
    base_price = item_meta["base_price"]
    
    # 1. Logika Tren Makro (Tahun 1 Perintisan -> Tahun 2 Target Wajib Pajak)
    if date.year == 2024:
        growth_multiplier = 1.0 + ((date.month - 1) * 0.015)
        qty_base_pemasukan = [1, 2, 3]
        qty_weights_pemasukan = [0.6, 0.3, 0.1]
        qty_base_pengeluaran = 1
    else:
        # Tahun 2 berkembang pesat (Omzet > Rp 4.8 Miliar)
        growth_multiplier = 4.2 + ((date.month - 1) * 0.12)
        qty_base_pemasukan = [3, 4, 5, 8, 12]
        qty_weights_pemasukan = [0.2, 0.3, 0.3, 0.15, 0.05]
        qty_base_pengeluaran = random.randint(3, 5)

    if date.weekday() >= 5:  
        growth_multiplier *= random.uniform(1.2, 1.35)
    if date.month in [3, 4]:  
        growth_multiplier *= random.uniform(1.15, 1.3) if tipe == "pemasukan" else 1.1

    # 2. Penentuan Kuantitas Khusus Item Langka (Aset) vs Umum (Consumables)
    if item_name in ASSET_ITEMS:
        # Barang aset dibeli satuan (tidak langsung borongan 5 meja sekaligus kecuali saat ekspansi)
        qty = 1 if date.year == 2024 else random.randint(1, 2)
        hour = random.randint(10, 15)  # Dibeli siang hari toko mebel/elektronik
        # Aset tidak terpengaruh inflasi multipler harian/bulanan secara agresif
        nominal = int(base_price * qty * random.uniform(0.98, 1.05))
    else:
        if tipe == "pemasukan":
            qty = random.choices(qty_base_pemasukan, weights=qty_weights_pemasukan)[0]
            hour = random.choice([random.randint(11, 14), random.randint(17, 21)])
        else:
            qty = qty_base_pengeluaran
            hour = random.randint(6, 10)
        
        cost_factor = 0.85 if tipe == "pengeluaran" and date.year == 2025 else 1.0
        nominal = int(base_price * qty * growth_multiplier * cost_factor * random.uniform(0.95, 1.05))
    
    nominal = round(nominal, -3) if nominal > 10000 else round(nominal, -2)
    return qty, nominal, hour

# =========================================================
# GENERATE SEED DATA
# =========================================================

rows = []
# Tracker untuk membatasi kemunculan aset pada seed data (maks 1-2 kali per tahun)
seed_asset_tracker = {year: {asset: 0 for asset in ASSET_ITEMS} for year in [2024, 2025]}

while len(rows) < TARGET_ROWS:
    current_date = random_date(START_DATE, END_DATE)
    item_name = random.choice(ITEM_NAMES)
    yr = current_date.year

    # Cek jika item terpilih adalah aset dan sudah melewati limit di data benih
    if item_name in ASSET_ITEMS:
        if seed_asset_tracker[yr][item_name] >= 2:  # Maks 2 kali per tahun di seed data
            item_name = random.choice(CONSUMABLE_ITEMS)  # Alihkan ke bahan baku biasa
        else:
            seed_asset_tracker[yr][item_name] += 1
    
    qty, nominal, hour = calculate_nominal(item_name, current_date)
    timestamp = current_date.replace(hour=hour, minute=random.randint(0, 59), second=random.randint(0, 59))
    
    rows.append({
        "keterangan": item_name,
        "qty": qty,
        "waktu": timestamp,
        "hour": timestamp.hour,
        "day_of_week": timestamp.weekday(),
        "month": timestamp.month,
        "year": timestamp.year
    })

df = pd.DataFrame(rows)
df = df.sort_values("waktu").reset_index(drop=True)

# =========================================================
# TRAIN CTGAN
# =========================================================

metadata = Metadata.detect_from_dataframe(df)
for col in ['hour', 'day_of_week', 'month', 'year', 'qty']:
    metadata.update_column(column_name=col, sdtype='categorical')

model = CTGANSynthesizer(metadata=metadata, epochs=40, batch_size=128, verbose=False)
model.fit(df)

# =========================================================
# GENERATE & POST-PROCESSING WITH INVENTORY CONTROLLER
# =========================================================

synthetic = model.sample(num_rows=SYNTHETIC_ROWS)

print("\nMemproses rekonstruksi data & mengendalikan pengeluaran aset...")

# Tracker pembatasan aset ketat untuk hasil akhir (Maksimum 2 pembelian/perbaikan per barang per tahun)
final_asset_tracker = {2024: {asset: 0 for asset in ASSET_ITEMS}, 2025: {asset: 0 for asset in ASSET_ITEMS}}
MAX_ASSET_PER_YEAR = 2

final_rows = []
for idx, row in synthetic.iterrows():
    item_name = row["keterangan"]
    dt = row["waktu"]
    yr = dt.year
    
    if item_name not in MASTER_ITEMS:
        item_name = random.choice(ITEM_NAMES)
        
    # LOGIKA KONTROL ASSET: Jika model CTGAN menghasilkan barang inventaris secara berlebihan,
    # kita tangkap di sini dan ubah transaksinya menjadi pembelian komoditas bahan baku (Consumables).
    if item_name in ASSET_ITEMS:
        if final_asset_tracker[yr][item_name] >= MAX_ASSET_PER_YEAR:
            item_name = random.choice(CONSUMABLE_ITEMS)
        else:
            final_asset_tracker[yr][item_name] += 1
            
    meta = MASTER_ITEMS[item_name]
    _, nominal, _ = calculate_nominal(item_name, dt)
    
    final_rows.append({
        "id_transaksi": f"TRX-{uuid.uuid4().hex[:12].upper()}",
        "waktu": dt,
        "keterangan": item_name,
        "kategori": meta["kategori"],
        "type": meta["tipe"],
        "nominal": nominal,
        "year": yr
    })

final_df = pd.DataFrame(final_rows)
final_df = final_df.sort_values("waktu").reset_index(drop=True)

# =========================================================
# VERIFIKASI PEMBELIAN BENTUK ASET & FINANSIAL
# =========================================================

print("\n" + "="*50)
print("          VERIFIKASI KEMUNCULAN BARANG ASET        ")
print("="*50)
for yr in [2024, 2025]:
    print(f"Tahun {yr}:")
    yr_data = final_df[final_df["year"] == yr]
    for asset in ASSET_ITEMS:
        kemunculan = len(yr_data[yr_data["keterangan"] == asset])
        total_pengeluaran_asset = yr_data[yr_data["keterangan"] == asset]["nominal"].sum()
        print(f" - {asset:<20}: Tergenerate {kemunculan}x | Total Biaya: Rp {total_pengeluaran_asset:,}")

print("\n" + "="*50)
print("     LAPORAN RINGKASAN FINANSIAL DATA SINTETIS     ")
print("="*50)

for yr in [2024, 2025]:
    yr_data = final_df[final_df["year"] == yr]
    pemasukan = yr_data[yr_data["type"] == "pemasukan"]["nominal"].sum()
    pengeluaran = yr_data[yr_data["type"] == "pengeluaran"]["nominal"].sum()
    profit = pemasukan - pengeluaran
    
    print(f"--- TAHUN {yr} ---")
    print(f"Total Transaksi : {len(yr_data):,}")
    print(f"Total Omzet     : Rp {pemasukan:,}")
    print(f"Total Pengeluaran: Rp {pengeluaran:,}")
    print(f"Net Profit      : Rp {profit:,}")
    
    if yr == 2025:
        if pemasukan >= 4800000000:
            print(f"Status Pajak    : Terbuka Sebagai WAJIB PAJAK (Omzet > Rp 4.8 Miliar) 🎉")
        else:
            print(f"Status Pajak    : Belum Wajib Pajak (Di bawah Rp 4.8 Miliar)")
print("="*50 + "\n")

# Hapus kolom pembantu sebelum export final
final_df = final_df.drop(columns=["year"])

# Export hasil akhir
out_path = "synthetic_umkm_10000.csv"
final_df.to_csv(out_path, index=False)
print(f"Proses Selesai! File bersih tersimpan di: {out_path}")