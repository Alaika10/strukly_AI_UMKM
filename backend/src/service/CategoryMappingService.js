import { getCategoryByName } from "../models/CategoryModel.js";

const OCR_CATEGORY_MAP = {
    "Makanan & Bahan Makanan": 1,
    "Bahan Baku": 1,
    "Utilities": 2,
    "Listrik & Air": 2,
    "Salary": 3,
    "Gaji Karyawan": 3,
    "Peralatan": 4,
    "Tax": 5,
    "Pajak": 5
};

export const getMappedCategoryId = async (ocrCategoryName) => {
    if (!ocrCategoryName) {
        return await getUncategorizedId();
    }

    const exactMapId = OCR_CATEGORY_MAP[ocrCategoryName];
    if (exactMapId) {
        return exactMapId;
    }

    return await getUncategorizedId();
};

export const getUncategorizedId = async () => {
    try {
        const cat = await getCategoryByName("Belum Dikategorikan");
        return cat?.id || null;
    } catch (e) {
        console.error("Failed to get 'Belum Dikategorikan' category:", e);
        return null;
    }
};
