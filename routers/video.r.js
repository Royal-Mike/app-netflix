const express = require("express");
const router = express.Router();
const videoC = require("../controllers/video.c");

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
});

router.get("/", videoC.watch);

module.exports = router;
