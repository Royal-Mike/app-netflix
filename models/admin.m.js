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
    static async addMovie(obj) {
        const id = await db.add("movies", obj);
        console.log(id)
        const genres = JSON.parse(obj.genres);
        console.log(genres)
        genres.forEach(async genre => {
            await db.add("movie_genres", { movie_id: id, genre_id: genre.id });
        });
        return id;
    }
    static async updateMovie(data) {
        const rs = await db.updateMovie(data);
        return rs;
    }
    static async deleteMovie(id) {
        const rs = await db.delete("movies", "id", id);
        return rs;
    }
    // Genre
    static async getAllGenres() {
        const rs = await db.getAll("genres", "id");
        return rs;
    }
    static async addGenre(obj) {
        const rs = await db.add("genres", obj);
        return rs;
    }
    static async updateGenre(data) {
        const rs = await db.updateGenre(data);
        return rs;
    }
    static async deleteGenre(id) {
        const rs = await db.delete("genres", "id", id);
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