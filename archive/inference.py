import tensorflow as tf
import numpy as np
import pickle
import json
import re

try:
    model = tf.keras.models.load_model('model_strukly.keras')
    with open('penerjemah_kategori.pkl', 'rb') as file:
        encoder = pickle.load(file)
except Exception as e:
    print(f"Error: {e}")

def parser_teks_ocr(teks_ocr: str) -> dict:
    hasil = {"merchant": None, "total_harga": None}
    
    merchant_match = re.search(r'^([A-Za-z\&\s]+)', teks_ocr)
    if merchant_match:
        hasil["merchant"] = merchant_match.group(1).strip()

    total_match = re.search(r'(?i)Total[\s:]*([\d.,]+)', teks_ocr)
    if total_match:
        hasil["total_harga"] = total_match.group(1)
        
    return hasil

def proses_struk_pipeline(teks_ocr: str) -> str:
    parsed_data = parser_teks_ocr(teks_ocr)
    
    input_data = tf.constant([teks_ocr])
    hasil_prediksi = model.predict(input_data, verbose=0)[0]
    
    indeks_tertinggi = np.argmax(hasil_prediksi)
    confidence = float(hasil_prediksi[indeks_tertinggi])
    kategori_teks = encoder.inverse_transform([indeks_tertinggi])[0]
    
    need_review = True if confidence < 0.75 else False
    
    output_akhir = {
        "merchant": parsed_data["merchant"],
        "total_harga": parsed_data["total_harga"],
        "category": kategori_teks,
        "confidence": round(confidence, 2),
        "need_review": need_review
    }
    
    return json.dumps(output_akhir)

if __name__ == "__main__":
    teks_noisy = "BrdTlkk @211 btcelsvecy BreadButter 14.000 Suntotal: 43.500 T0tal 43.500"
    hasil_json = proses_struk_pipeline(teks_noisy)
    print(hasil_json)
