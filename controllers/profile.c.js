// const profileM = require('../models/profile.m');

module.exports = {
    profile: async (req, res) => {
        res.render('account/profile', {
            title: 'Profile',
            home: true,
            profile: true
        })
    }
};
