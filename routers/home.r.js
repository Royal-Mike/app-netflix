const express = require("express");
const router = express.Router();
const homeC = require("../controllers/home.c");

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
});

router.post("/getKeyWords", homeC.getKeyWords);
router.get("/", homeC.home);

router.post("/playList", homeC.addPlayList);
router.post("/liked", homeC.liked);

module.exports = router;
