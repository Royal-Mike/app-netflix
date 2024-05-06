const homeM = require('../models/home.m');

// $('.fa-thumbs-up').on('click',function () {
//     const movieId = $('.fa-thumbs-up').html();
//     console.log("the movieID: ", movieId)
// })

module.exports = {
    home: async (req, res) => {
        try {
			let theme = req.cookies.theme;
			let dark = theme === "dark" ? true : false;
			const user_id = await accountM.getUserIdByUsername(req.user.username);
			const subscription = await subscribeM.getSubscriptionByUserId(user_id);

			// Check if a user has a subscription or expired subscription
			if (!subscription) {
				res.redirect('/subscribe');
			} else {
				if (subscription.status === 'none'|| subscription.end_date < new Date())
				res.redirect('/subscribe');
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
				});
			}
		} catch (error) {
			console.error('Error getting home page:', error);
		}
        let theme = req.cookies.theme;
        let userID = req.session.username;


        
       

        console.log("ussername: ",userID); //tim dc username

        let movieID = 693134  
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
            upcoming_movies,
            userID: userID
            
        })
    },
    addPlayList : async (req, res) => {
        const userID = req.body.userID
        const movieID = req.body.movieID
        const addToPlayList = await homeM.addToPlayList(userID,movieID);
        return "success"
    },
    liked : async (req, res) => {
        const userID = req.body.userID
        const movieID = req.body.movieID
        const increaseLiked = await homeM.increaseLiked(userID,movieID);
        return "success"
    }
};
