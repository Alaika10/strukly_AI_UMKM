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

    const dateMatch = text.match(/\d{2}[\/\-]\d{2}[\/\-]\d{4}/);

    if (dateMatch) {
        const [d, m, y] = dateMatch[0].split(/[\/\-]/);
        date = `${y}-${m}-${d}`;
    }

    return {
        merchant,
        amount,
        date,
    };
};
