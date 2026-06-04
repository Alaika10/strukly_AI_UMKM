import axios from "axios";
import FormData from "form-data";

const OCR_SERVICE_URL = process.env.OCR_SERVICE_URL;

export const sendToOCR = async (fileBuffer, filename) => {
    try {
        const formData = new FormData();
        formData.append("file", fileBuffer, filename || "receipt.jpg");

        console.log(`Sending file to OCR service: ${OCR_SERVICE_URL}`);

        const response = await axios.post(OCR_SERVICE_URL, formData, {
            headers: formData.getHeaders(),
        });

        // Logging response OCR untuk debugging
        console.log("OCR SERVICE SUCCESS RESPONSE:", response.data);

        return response.data;
    } catch (error) {
        // Tangani error FastAPI dengan baik
        if (error.response) {
            console.error("OCR Service responded with error status:", error.response.status);
            console.error("OCR Service error response data:", error.response.data);
            throw new Error(`OCR service failed with status ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            console.error("No response received from OCR Service:", error.request);
            throw new Error("No response received from OCR Service");
        } else {
            console.error("OCR Service setup error:", error.message);
            throw new Error(`OCR Service request failed: ${error.message}`);
        }
    }
};
