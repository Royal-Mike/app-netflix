const likedListM = require('../models/likeList.m'); 

module.exports = {
    getList: async (req, res, next) => {
        const userId = req.session.username
       const movie = await likedListM.getAllMovieList(userId)
            let theme = req.cookies.theme;
            let dark = theme === "dark" ? true : false;
            console.log(movie);
            res.render('likedList', {
                title: "Liked List",
               
                dark: dark,
                movie: movie
            })
        }
    };
      
        
