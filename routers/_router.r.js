const express = require("express");
const router = express.Router();

const accountR = require("./account.r");
const profileR = require("./profile.r");
const homeR = require("./home.r");
const adminR = require("./admin.r");
const videoR = require("./video.r");
const searchR = require("./search.r");
const subscribeR = require("./subscribe.r");

router.use("/acc", accountR);
router.use("/account", profileR);
router.use("/home", homeR);
router.use("/admin", adminR);
router.use("/watch", videoR);
router.use("/search", searchR);
router.use("/subscribe", subscribeR);

const initializeDBM = require("../models/initdb.m");

router.get('/', async (req, res) => {
    let theme = req.cookies.theme;
    let dark = theme === "dark" ? true : false;

    const check = await initializeDBM.checkExistDB();
    if (!check) {
        await initializeDBM.createDB();
    }

    res.render('account/login', {
        title: 'Login',
        home: false,
        dark: dark
    })
});

router.get('/signup', async (req, res) => {
    let theme = req.cookies.theme;
    let dark = theme === "dark" ? true : false;

    const check = await initializeDBM.checkExistDB();
    if (!check) {
        await initializeDBM.createDB();
    }

    res.render('account/signup', {
        title: 'Sign Up',
        home: false,
        dark: dark
    })
});

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) throw err;
    });
    res.redirect("/");
});

module.exports = router;