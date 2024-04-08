const db = require('./_db');

module.exports = class Admin {
    static async getCount(table) {
        const rs = await db.getCount(table);
        return rs;
    }
    // Movie
    static async getAllMovies() {
        const rs = await db.getAll("movies", "id");
        return rs;
    }
    // Genre
    static async getAllGenres() {
        const rs = await db.getAll("genres", "id");
        return rs;
    }
    static async updateGenre(data) {
        const rs = await db.updateGenre(data);
        return rs;
    }
    // User
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