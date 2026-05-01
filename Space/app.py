from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from paddleocr import PaddleOCR
import cv2
import numpy as np

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
    det_limit_side_len=512
)

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
                
        ocr_mentah = " ".join(teks_terbaca)
        
        return {"sukses": True, "ocr_mentah": ocr_mentah}
    except Exception as e:
        return JSONResponse(status_code=500, content={"sukses": False, "pesan": str(e)})