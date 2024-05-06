const db = require('./_db');
const moviesTb = "movies";
const popularMoviesTb = "popular_movies";
const nowPlayingTb = "now_playing_movies";
const topRatedTb = "top_rated_movies";
const upcomingTb = "upcoming_movies";

module.exports = class Home {
    static async getPopularMovies() {
        const rtDat = await db.getPopularMovies(moviesTb, popularMoviesTb);
        return rtDat;
    }
    
    static async getNowPlayingMovies() {
        const rtDat = await db.getNowPlayingMovies(moviesTb, nowPlayingTb);
        return rtDat;
    }

    static async getTopRatedMovies() {
        const rtDat = await db.getTopRatedMovies(moviesTb, topRatedTb);
        return rtDat;
    }

    static async getUpcomingMovies() {
        const rtDat = await db.getUpcomingMovies(moviesTb, upcomingTb);
        return rtDat;
    }

    static async addToPlayList(userID,movieID) {
        const rtDat = await db.addPlayList(userID,movieID);
        return rtDat;
    }

    static async increaseLiked(userID, movieID) {
        const rtDat = await db.increaseLikedMovie(userID, movieID);
        return rtDat;
    }
}