const homeM = require('../models/home.m');
const subscribeM = require('../models/subscribe.m');
const accountM = require('../models/account.m');

module.exports = {
    home: async (req, res) => {
        try {
			let theme = req.cookies.theme;
			let userID = req.session.username;

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
	},
	getKeyWords: async (req, res) => {
		try {
			try {
                const response = await fetch('https://api.textrazor.com/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-TextRazor-Key': "4c77e97c4ce07a96701879736016c67eb230e92c2418998fb81d4714",
                        'Accept-encoding': 'gzip'
                    },
                    body: `text=${req.body.text}&extractors=topics`
                });

                const data = await response.json();
				if (data.response.topics) {
					const highestScore = data.response.topics[0];
                	res.json({ data: highestScore })
				} else {
					res.json({ data: "search categories"})
				}
            } catch (error) {
                console.error(error);
            }
		} catch (error) {
			console.error('Error getting home page:', error);
		}
	},
    addPlayList: async (req, res) => {
        const userID = req.session.username;
        const movieID = req.body.movieID;
        const result = await homeM.addToPlayList(userID, movieID);
        res.send(result);
    },
    liked: async (req, res) => {
        const userID = req.session.username;
        const movieID = req.body.movieID;
        const result = await homeM.increaseLiked(userID, movieID);
        res.send(result);
    }
};
