import os
import csv
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

# Try to load environment variable from backend/.env if running from root
load_dotenv('backend/.env')

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set. Please set it in backend/.env")

def map_category(raw_category, type_name):
    raw = str(raw_category).lower()
    
    if type_name == 'pengeluaran':
        if 'listrik' in raw or 'air' in raw or 'utilitas' in raw:
            return 2
        elif 'gaji' in raw or 'karyawan' in raw:
            return 3
        elif 'alat' in raw or 'peralatan' in raw:
            return 4
        elif 'pajak' in raw:
            return 5
        else:
            return 1 # Default expense: Bahan Baku
            
    elif type_name == 'pemasukan':
        if 'makanan' in raw:
            return 7
        elif 'minuman' in raw:
            return 8
        elif 'jasa' in raw:
            return 9
        elif 'lain' in raw:
            return 10
        else:
            return 6 # Default income: Penjualan Produk
            
    return 6

def main():
    csv_file = "data/Data_Sintesis/synthetic_umkm_10000.csv"
    if not os.path.exists(csv_file):
        raise FileNotFoundError(f"File not found: {csv_file}")
        
    print(f"Connecting to DB...")
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    print("Ensuring user 999 exists...")
    cursor.execute("""
        INSERT INTO users (id, name, email, password) 
        VALUES (999, 'Akun Demo', 'demo@umkm.com', 'dummy_hash')
        ON CONFLICT (id) DO NOTHING;
    """)
    
    records = []
    with open(csv_file, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            transaction_date = row['waktu']
            merchant = row['keterangan']
            raw_type = row['type'].strip().lower()
            t_type = 'income' if raw_type == 'pemasukan' else 'expense'
            amount = float(row['nominal'])
            category_id = map_category(row['kategori'], raw_type)
            
            records.append((
                999,
                category_id,
                amount,
                merchant,
                transaction_date,
                'synthetic',
                t_type
            ))
            
    print(f"Prepared {len(records)} records for insertion. Executing bulk insert...")
    
    insert_query = """
    INSERT INTO transactions (user_id, category_id, amount, merchant, transaction_date, source, type)
    VALUES %s
    """
    
    execute_values(cursor, insert_query, records)
    conn.commit()
    
    cursor.close()
    conn.close()
    print("Successfully inserted 10,000 synthetic data to PostgreSQL.")

if __name__ == "__main__":
    main()
