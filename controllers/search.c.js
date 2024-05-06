const searchM = require('../models/search.m');
module.exports = {
    search: async (req, res) => {
        let theme = req.cookies.theme;
        let dark = theme === "dark" ? true : false;
        const searchMovies = await searchM.searchMovies(req.query.query, 1);
        res.render('search', {
            title: 'Search',
            home: true,
            dark: dark,
            searchMovies,
            search: req.query.query
        })
    }
};
