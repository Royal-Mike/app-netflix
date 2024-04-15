const adminM = require('../models/admin.m');
// const productM = require("../models/product.m");

function getPageIndices(page) {
    let indexStart = (page - 1) * 10;
    let indexEnd = indexStart + 10;
    return { start: indexStart, end: indexEnd };
}

module.exports = {
    home: async (req, res) => {
        let theme = req.cookies.theme;
        let dark = theme === "dark" ? true : false;

        const data_m = await adminM.getCount("movies");
        const pages_m = Math.ceil(data_m.count / 10);

        const genres = await adminM.getAllGenres();
        const data_g = await adminM.getCount("genres");
        const pages_g = Math.ceil(data_g.count / 10);

        const data_u = await adminM.getCount("users");
        const pages_u = Math.ceil(data_u.count / 10);

        function makeArray(pages) {
            return [...Array(pages + 1).keys()].slice(1)
        }

        res.render('admin/home', {
            title: 'Admin',
            dark: dark,
            admin: true,
            genres: genres,
            pages_m: makeArray(pages_m),
            pages_g: makeArray(pages_g),
            pages_u: makeArray(pages_u)
        });
    },
    // Movie
    getMovies: async (req, res) => {
        const indices = getPageIndices(req.body.page);
        const result = await adminM.getAllMovies();
        const page = result.slice(indices.start, indices.end);
        res.send(page);
    },
    addMovie: async (req, res) => {
        await adminM.addMovie({ name: req.body.name });
        res.send('success');
    },
    updateMovie: async (req, res) => {
        const data = {
            id: req.body.id,
            name: req.body.name
        };
        await adminM.updateMovie(data);
        res.send('success');
    },
    deleteMovie: async (req, res) => {
        await adminM.deleteMovie(req.body.id);
        res.send('success');
    },
    // Genre
    getGenres: async (req, res) => {
        const indices = getPageIndices(req.body.page);
        const result = await adminM.getAllGenres();
        const page = result.slice(indices.start, indices.end);
        res.send(page);
    },
    addGenre: async (req, res) => {
        await adminM.addGenre({ name: req.body.name });
        res.send('success');
    },
    updateGenre: async (req, res) => {
        const data = {
            id: req.body.id,
            name: req.body.name
        };
        await adminM.updateGenre(data);
        res.send('success');
    },
    deleteGenre: async (req, res) => {
        await adminM.deleteGenre(req.body.id);
        res.send('success');
    },
    // User
    getUsers: async (req, res) => {
        const indices = getPageIndices(req.body.page);
        const result = await adminM.getAllUsers();
        const page = result.slice(indices.start, indices.end);
        res.send(page);
    },
    adminUser: async (req, res) => {
        await adminM.makeAdminUser(req.body.username);
        res.send('success');
    },
    deleteUser: async (req, res) => {
        const deleteName = req.body.username;
        if (deleteName === req.user.username) return res.send('err_username');
        await adminM.deleteUser(deleteName);
        res.send('success');
    }
};
