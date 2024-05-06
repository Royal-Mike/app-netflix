const accountM = require('../models/account.m');

module.exports = {
    profile: async (req, res) => {
        const data = await accountM.getAccount(req.user.username);
        res.render('account/profile', {
            title: 'Profile',
            data: data,
            home: true,
            profile: true
        })
    }
};
