# Gunakan dasar sistem operasi Linux dengan Python 3.9
FROM python:3.9

# Instal dependensi sistem yang dibutuhkan oleh OpenCV
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0

# Buat user baru (Syarat keamanan dari Hugging Face)
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

# Salin file requirements dan instal
COPY --chown=user requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Salin semua kode dan model kamu ke dalam kontainer
COPY --chown=user . /app

# Jalankan server FastAPI di port 7860 (Port standar Hugging Face)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]