const express = require("express");
const router = express.Router();
const profileC = require("../controllers/profile.c");

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
});

router.get("/", profileC.profile);

module.exports = router;
