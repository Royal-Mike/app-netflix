const listM = require('../models/list.m'); 

module.exports = {
    getList: async (req, res, next) => {
        const userId = req.session.username
        const movie = await listM.getAllMovieList(userId)
        res.render('list', {
            title: "My List",
            home: true,
            search: true,
            movie: movie
        });
    }
};