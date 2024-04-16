module.exports = {
    watch: async (req, res) => {
        let theme = req.cookies.theme;
        let dark = theme === "dark" ? true : false;
        let title = req.query.name;
        res.render('video', {
            title: 'Movie',
            video: true,
            dark: dark,
            title
        })
    }
};
