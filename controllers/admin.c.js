const adminM = require('../models/admin.m');
// const productM = require("../models/product.m");

module.exports = {
    home: async (req, res) => {
        let theme = req.cookies.theme;
        let dark = theme === "dark" ? true : false;

        // const products = await adminM.getAllProducts();

        // const pages_p = Math.ceil(products.length / 100);

        // function makeArray(pages) {
        //     return [...Array(pages + 1).keys()].slice(1)
        // }

        res.render('admin/home', {
            title: 'Admin',
            dark: dark,
            admin: true,
            // pages_p: makeArray(pages_p)
        });
    },
    getPro: async (req, res) => {
        let page = req.body.page;
        let indexStart = (page - 1) * 100;
        let indexEnd = indexStart + 100;
        const products = await adminM.getAllProducts();
        const productsPage = products.slice(indexStart, indexEnd);
        res.send(productsPage);
    },
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
