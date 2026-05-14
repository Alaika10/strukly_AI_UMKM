import tensorflow as tf
import pickle
import numpy as np

try:
    model = tf.keras.models.load_model('model_strukly.keras')
    with open('penerjemah_kategori.pkl', 'rb') as file:
        encoder = pickle.load(file)
except Exception as e:
    print(f"Error: {e}")

def prediksi_kategori_struk(teks_barang: str) -> str:
    input_data = np.array([teks_barang])
    hasil_prediksi = model.predict(input_data, verbose=0)
    indeks_tertinggi = np.argmax(hasil_prediksi[0])
    kategori_teks = encoder.inverse_transform([indeks_tertinggi])[0]
    return kategori_teks

if __name__ == "__main__":
    contoh_teks_ocr = "Nasi Mandhi Instan 350Gr"
    hasil = prediksi_kategori_struk(contoh_teks_ocr)
    print(f"Teks Input : {contoh_teks_ocr}")
    print(f"Kategori   : {hasil}")