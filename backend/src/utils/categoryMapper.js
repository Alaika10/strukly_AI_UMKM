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

    const lowerInput = input.toLowerCase();

    for (const category in categoryKeywords) {
        const keywords = categoryKeywords[category];

        if (keywords.some((word) => lowerInput.includes(word))) {
            return category;
        }
    }

    return "Other";
};
