const db = require('./_db');

module.exports = class Admin {
    static async getAllCatalogues() {
        const rs = await db.getAll("catalogue", "id_category");
        return rs;
    }
    static async getAllProducts() {
        const rs = await db.getAll("products", "id");
        return rs;
    }
    static async getAllUsers() {
        const rs = await db.getAll("users", "role");
        return rs;
    }
    static async makeAdminUser(username) {
        const rs = await db.updateAdmin(username);
        return rs;
    }
    static async deleteUser(username) {
        const rs = await db.delete("users", "username", username);
        return rs;
    }
}