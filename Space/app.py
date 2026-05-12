from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from paddleocr import PaddleOCR
from datetime import datetime
import cv2
import re
import numpy as np
import random


app = FastAPI(title="OCR Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # ganti dengan URL Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

paddle_engine = PaddleOCR(
    lang='id',
    show_log=False,
    use_angle_cls=False,
    enable_mkldnn=True,
    cpu_threads=2,
    ocr_version="PP-OCRv4",
    det_limit_side_len=640
)

#FUNGSI EKSTRAKSI TANGGAL
MONTH_MAP = {
    "jan": 1, "januari": 1,
    "feb": 2, "februari": 2,
    "mar": 3, "maret": 3,
    "apr": 4, "april": 4,
    "ap": 4,
    "mei": 5,
    "jun": 6, "juni": 6,
    "jul": 7, "juli": 7,
    "aug": 8, "agu": 8, "agustus": 8,
    "sep": 9, "september": 9,
    "oct": 10, "okt": 10, "oktober": 10,
    "nov": 11, "november": 11,
    "dec": 12, "des": 12, "desember": 12
}

def extract_transaction_date(raw_text: str):
    # OCR cleanup
    raw_text = raw_text.replace("O", "0").replace("I", "1")
    raw_text = re.sub(r"\s+", " ", raw_text)

    patterns = [
        # dd/mm/yyyy | dd-mm-yyyy | dd.mm.yyyy
        r'\d{2}[\/\-.]\d{2}[\/\-.]\d{4}',

        # dd/mm/yy | dd-mm-yy | dd.mm.yy
        r'\d{2}[\/\-.]\d{2}[\/\-.]\d{2}(?!\d)',

        # yyyy/mm/dd
        r'\d{4}[\/\-.]\d{2}[\/\-.]\d{2}',

        # yyyymmdd
        r'\d{8}(?!\d)',

        # 31 Feb 25 / 31 Februari 2025
        r'\d{1,2}\s[a-zA-Z]+\s\d{2,4}'
    ]

    numeric_formats = [
        "%d/%m/%Y", "%d-%m-%Y", "%d.%m.%Y",
        "%d/%m/%y", "%d-%m-%y", "%d.%m.%y",
        "%Y/%m/%d", "%Y-%m-%d", "%Y.%m.%d",
        "%Y%m%d"
    ]

    candidates = []

    for pattern in patterns:
        matches = re.findall(pattern, raw_text, re.IGNORECASE)

        for text in matches:
            dt = None
            # numeric formats
            for fmt in numeric_formats:
                try:
                    dt = datetime.strptime(text, fmt)
                    break
                except:
                    continue

            # text month format
            if not dt:
                match = re.match(
                    r'(\d{1,2})\s([a-zA-Z]+)\s(\d{2,4})',
                    text,
                    re.IGNORECASE
                )
                if match:
                    day, month_txt, year = match.groups()
                    month = MONTH_MAP.get(month_txt.lower())

                    if month:
                        year = int(year)
                        if year < 100:
                            year += 2000
                        dt = datetime(year, month, int(day))

            if dt:
                candidates.append(dt)

    if not candidates:
        return None

    best_date = max(candidates)
    return best_date.strftime("%d-%m-%Y")

@app.get("/")
def home():
    return {"status": "Optima Team - OCR API Aktif :D !"}

@app.post("/scan-ocr/")
async def proses_gambar_paddle(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        result = paddle_engine.ocr(img)
        
        teks_terbaca = []
        if result and result[0]:
            for baris in result[0]:
                teks = baris[1][0]
                teks_terbaca.append(teks)
                
        ocr_mentah = "\n".join(teks_terbaca)
        date = extract_transaction_date(ocr_mentah)
        items = "Ini Daftar Item ✅"
        merchant = "Ini Nama Merchant ✅"
        total = random.randint(10, 10000)*100
        classes = 2
        return {"sukses": True, "ocr_mentah": ocr_mentah, "date": date, "items": items, "merchant": merchant, "total": total, "classes": classes}
    except Exception as e:
        return JSONResponse(status_code=500, content={"sukses": False, "pesan": str(e)})