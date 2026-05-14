import re

def ekstrak_info_tambahan(teks_ocr: str) -> dict:
    hasil = {
        "Merchant": "Tidak Terdeteksi",
        "Total_Harga": "0"
    }
    
    merchant_match = re.search(r'^([A-Za-z\&\s]+)', teks_ocr)
    if merchant_match:
        hasil["Merchant"] = merchant_match.group(1).strip()

    total_match = re.search(r'(?i)Total[\s:]*([\d.,]+)', teks_ocr)
    if total_match:
        hasil["Total_Harga"] = total_match.group(1)
        
    return hasil

if __name__ == "__main__":
    teks_mentah = "BreadTalk L SPFED @211 1POS ww.btcelsvecy.com 15065510P heckNo3089 10191632:4 BreadButter Fuso 14.000 11.500 Crean Bruille Choco Crossant 10.500 1BarOr Crocolat 7.900 Suntotal: 43.500 Total: 43.500 Pavent: 43.500 DebItCA 43.500 Therk You Please Ccre fcan"
    info = ekstrak_info_tambahan(teks_mentah)
    print(f"Merchant Terdeteksi : {info['Merchant']}")
    print(f"Total Harga         : Rp {info['Total_Harga']}")