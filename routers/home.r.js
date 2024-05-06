const express = require("express");
const router = express.Router();
const userC = require("../controllers/home.c");

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
});

router.post("/getKeyWords", userC.getKeyWords);
router.get("/", userC.home);

module.exports = router;
