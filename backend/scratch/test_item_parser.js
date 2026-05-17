function parseItemsFromOCR(text) {
    if (!text) return [];

    const items = [];
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

    const ignoreKeywords = /t[0o]t[a4]l|subt[0o]t[a4]l|jumlah|grand|tunai|cash|kembalian|change|diskon|discount|tax|pajak|ppn|pembulatan|suntotal|bayar|kembali|payment|change/i;

    for (const line of lines) {
        if (ignoreKeywords.test(line)) {
            continue;
        }

        const priceMatch = line.match(/(.*?)\s+(\d{1,3}(?:[.,]\d{3})+|\d{3,7})\s*$/);
        
        if (priceMatch) {
            let name = priceMatch[1].trim();
            const priceStr = priceMatch[2];
            
            if (name.length > 2 && !/^[.\-\s\d]+$/.test(name)) {
                const price = parseInt(priceStr.replace(/[.,]/g, ""));
                
                let qty = 1;
                
                // 1. Try matching "2x" or "2 x" (digit followed by x)
                let qtyMatch = line.match(/\b(\d{1,2})\s*x\b/i);
                
                // 2. Try matching "@ 2" or "x 2"
                if (!qtyMatch) {
                    qtyMatch = line.match(/(?:@|x)\s*(\d{1,2})\b/i);
                }
                
                if (qtyMatch) {
                    qty = parseInt(qtyMatch[1]);
                }

                // Clean quantity annotations from item name for cleaner representation
                name = name.replace(/(?:@|x)\s*\d+\s*$/i, "").trim();
                name = name.replace(/\b\d+\s*x\b/i, "").trim();
                name = name.replace(/\s*x\s*\d+\s*$/i, "").trim();

                items.push({
                    name: name,
                    quantity: qty,
                    price: price,
                });
            }
        }
    }

    return items;
}

const sample1 = `
BrdTlkk @211 btcelsvecy
BreadButter 14.000
Suntotal: 43.500
T0tal 43.500
`;
const sample2 = `
Nasi Mandhi Instan 350Gr 45,000
Mie Goreng @ 1
Mie Goreng @ 1 15.000
Aqua 2x 3.000
Total 78.000
`;

console.log("Sample 1 Items:", parseItemsFromOCR(sample1));
console.log("Sample 2 Items:", parseItemsFromOCR(sample2));
