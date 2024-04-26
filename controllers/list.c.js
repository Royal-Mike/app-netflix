const listM = require('../models/list.m'); 

module.exports = {
    getList: async (req, res, next) => {
        const userId = req.session.username
       const movie = await listM.getAllMovieList(userId)
            let theme = req.cookies.theme;
            let dark = theme === "dark" ? true : false;
            console.log(movie);
            res.render('list', {
                title: "My List",
               
                dark: dark,
                movie: movie
            })
        }
    };
      
        
