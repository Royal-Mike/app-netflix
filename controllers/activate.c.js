const subscribeM = require('../models/subscribe.m');

module.exports = {
	activateSubscription: async (req, res) => {
		try {
			const subscribeCode = req.query.subscribeCode;

			await subscribeM.updateSubscription(subscribeCode, 'subscribed', new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

			res.render('activate', { title: 'Subscription Activated' });
		} catch (error) {
			console.error('Error activating subscription:', error);
			res.redirect('/subscribe');
		}
	}
};
