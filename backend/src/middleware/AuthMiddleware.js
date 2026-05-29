import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "No token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const secret = process.env.ACCESS_TOKEN_KEY || "fallback_secret";
        const decoded = jwt.verify(token, secret);

        req.user = decoded;

        next();
    } catch {
        res.status(403).json({ error: "Invalid token" });
    }
};
