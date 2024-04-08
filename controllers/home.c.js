const homeM = require('../models/home.m');
module.exports = {
    home: async (req, res) => {
        let theme = req.cookies.theme;
        let dark = theme === "dark" ? true : false;
        const popular_movies = await homeM.getPopularMovies();
        const now_playing_movies = await homeM.getNowPlayingMovies();
        const top_rated_movies = await homeM.getTopRatedMovies();
        const upcoming_movies = await homeM.getUpcomingMovies();
        res.render('home', {
            title: 'Home',
            home: true,
            dark: dark,
            popular_movies,
            now_playing_movies,
            top_rated_movies,
            upcoming_movies
        })
    }
};
