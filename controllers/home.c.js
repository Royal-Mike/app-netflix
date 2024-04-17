const homeM = require('../models/home.m');
const subscribeM = require('../models/subscribe.m');
const accountM = require('../models/account.m');
module.exports = {
  home: async (req, res) => {
    try {
      let theme = req.cookies.theme;
      let dark = theme === "dark" ? true : false;
      const user_id = await accountM.getUserIdByUsername(req.user.username);
      const subscription = await subscribeM.getSubscriptionByUserId(user_id);


      if (!subscription || subscription.status === 'none') {
        res.redirect('/subscribe');
      } else {
        const currentDate = new Date();
        const subscriptionEndDate = new Date(subscription.end_date);

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
         }   catch (error) {
      console.error('Error getting home page:', error);
    }
  },
};
