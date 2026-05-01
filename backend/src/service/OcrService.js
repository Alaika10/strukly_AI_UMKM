import axios from "axios";
import FormData from "form-data";

const OCR_SERVICE_URL =
    process.env.OCR_SERVICE_URL || "https://sicheater99-ocr.hf.space/scan-ocr/";

export const sendToOCR = async (fileBuffer, filename) => {
    try {
        const formData = new FormData();
        formData.append("file", fileBuffer, filename || "receipt.jpg");

        const response = await axios.post(OCR_SERVICE_URL, formData, {
            headers: formData.getHeaders(),
        });

        return response.data;
    } catch (error) {
        throw new Error("OCR service error: " + error.message);
    }
};
