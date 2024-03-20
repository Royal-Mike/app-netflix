module.exports = {
    watch: async (req, res) => {
        let theme = req.cookies.theme;
        let dark = theme === "dark" ? true : false;

        res.render('video', {
            title: 'Movie',
            video: true,
            dark: dark
        })
    }
};
