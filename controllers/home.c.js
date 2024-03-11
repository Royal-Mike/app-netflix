module.exports = {
    home: async (req, res) => {
        let theme = req.cookies.theme;
        let dark = theme === "dark" ? true : false;

        res.render('home', {
            title: 'Home',
            home: true,
            dark: dark
        })
    }
};
