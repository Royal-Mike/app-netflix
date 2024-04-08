const adminM = require('../models/admin.m');
// const productM = require("../models/product.m");

function getPageIndices(page) {
    let indexStart = (page - 1) * 100;
    let indexEnd = indexStart + 100;
    return { start: indexStart, end: indexEnd };
}

module.exports = {
    home: async (req, res) => {
        let theme = req.cookies.theme;
        let dark = theme === "dark" ? true : false;

        const users = await adminM.getAllUsers();

        const pages_u = Math.ceil(users.length / 100);

        function makeArray(pages) {
            return [...Array(pages + 1).keys()].slice(1)
        }

        res.render('admin/home', {
            title: 'Admin',
            dark: dark,
            admin: true,
            pages_u: makeArray(pages_u)
        });
    },
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
    },
    // getPro: async (req, res) => {
    //     let page = req.body.page;
    //     let indexStart = (page - 1) * 100;
    //     let indexEnd = indexStart + 100;
    //     const products = await adminM.getAllProducts();
    //     const productsPage = products.slice(indexStart, indexEnd);
    //     res.send(productsPage);
    // },
    // updatePro: async (req, res) => {
    //     await productM.updatePro(new productM(req.body));
    //     res.send('success');
    // },
    // addPro: async (req, res) => {
    //     await productM.addPro(new productM(req.body));
    //     res.send('success');
    // },
    // deletePro: async (req, res) => {
    //     await productM.deletePro(req.body.id);
    //     res.send('success');
    // }
};
