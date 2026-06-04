import bcrypt from "bcrypt";
import {
    findUserById,
    updateProfile,
    updateSecurity,
    updateNotificationSettings,
    updatePassword,
} from "../models/UserModel.js";

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await findUserById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Jangan kirim password
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;
        res.json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateProfileController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, business_name, business_category, logo_url } = req.body;

        const updated = await updateProfile(userId, {
            name,
            business_name,
            business_category,
            logo_url,
        });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateSecurityController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { current_password, new_password, two_factor_enabled } = req.body;

        // If updating password
        if (new_password) {
            if (!current_password) {
                return res
                    .status(400)
                    .json({ error: "Current password required" });
            }

            const user = await findUserById(userId);
            const match = await bcrypt.compare(current_password, user.password);

            if (!match) {
                return res.status(400).json({ error: "Wrong current password" });
            }

            const hashed = await bcrypt.hash(new_password, 10);
            await updatePassword(userId, hashed);
        }

        const updated = await updateSecurity(userId, { two_factor_enabled });

        res.json({
            message: "Security settings updated successfully",
            two_factor_enabled: updated.two_factor_enabled,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateNotificationsController = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            notif_stock_reminder,
            notif_daily_summary,
            notif_tax_reminder,
            notif_monthly_report,
        } = req.body;

        const updated = await updateNotificationSettings(userId, {
            notif_stock_reminder,
            notif_daily_summary,
            notif_tax_reminder,
            notif_monthly_report,
        });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
