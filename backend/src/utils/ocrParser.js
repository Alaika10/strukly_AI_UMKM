export const parseOCRText = (text) => {
    if (!text) return {};

    const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

    const merchant = lines[0] || "Unknown";

    let amount = 0;

    const totalLine = lines.find((line) =>
        /total|jumlah|grand total/i.test(line),
    );

    if (totalLine) {
        const match = totalLine.match(/\d[\d.,]*/);
        if (match) {
            amount = parseInt(match[0].replace(/[.,]/g, ""));
        }
    }

    // fallback
    if (!amount) {
        const numbers = text.match(/\d[\d.,]*/g);
        if (numbers) {
            amount = Math.max(
                ...numbers.map((n) => parseInt(n.replace(/[.,]/g, ""))),
            );
        }
    }

    let date = new Date().toISOString().split("T")[0];

    const dateMatch = text.match(/\d{2}[/-]\d{2}[/-]\d{4}/);

    if (dateMatch) {
        const [d, m, y] = dateMatch[0].split(/[/-]/);
        date = `${y}-${m}-${d}`;
    }

    return {
        merchant,
        amount,
        date,
    };
};

export const parseItemsFromOCR = (text) => {
    if (!text) return [];

    const items = [];
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

    const ignoreKeywords =
        /t[0o]t[a4]l|subt[0o]t[a4]l|jumlah|grand|tunai|cash|kembalian|change|diskon|discount|tax|pajak|ppn|pembulatan|suntotal|bayar|kembali|payment|change/i;

    for (const line of lines) {
        if (ignoreKeywords.test(line)) {
            continue;
        }

        const priceMatch = line.match(
            /(.*?)\s+(\d{1,3}(?:[.,]\d{3})+|\d{3,7})\s*$/,
        );

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
};

