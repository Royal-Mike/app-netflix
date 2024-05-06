const accountM = require('../models/account.m');

module.exports = {
    profile: async (req, res) => {
        const data = await accountM.getAccount(req.user.username);
        const sub = await accountM.getSubscription(req.user.id);
        res.render('account/profile', {
            title: 'Profile',
            data: data,
            sub: sub,
            home: true,
            profile: true
        })
    }
};
