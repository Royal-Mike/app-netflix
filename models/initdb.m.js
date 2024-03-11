const db = require('./_db');

module.exports = class Home {
    static async checkExistDB() {
        const rs = await db.checkExistDB();
        return rs;
    }
    static async createDB() {
        await db.createDB();
    }
}