const categoryKeywords = {
    "F&B": [
        "food",
        "makan",
        "restaurant",
        "cafe",
        "kopi",
        "alfamart",
        "indomaret",
    ],
    Transport: ["gojek", "grab", "transport", "taxi"],
    Shopping: ["shop", "mall", "store"],
    Bills: ["listrik", "air", "internet"],
};

export const mapCategory = (input) => {
    if (!input) return "Other";

    let strInput = "";
    if (Array.isArray(input)) {
        strInput = String(input[0] || "");
    } else {
        strInput = String(input);
    }

    if (!strInput) return "Other";

    const lowerInput = strInput.toLowerCase().trim();

    // 1. Direct match check (in case it is already one of the official DB categories)
    const dbCategories = ["F&B", "Transport", "Shopping", "Bills", "Other"];
    const matched = dbCategories.find(
        (c) => c.toLowerCase() === lowerInput,
    );
    if (matched) return matched;

    // 2. Keyword mapping check
    for (const category in categoryKeywords) {
        const keywords = categoryKeywords[category];

        if (keywords.some((word) => lowerInput.includes(word))) {
            return category;
        }
    }

    return "Other";
};
