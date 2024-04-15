const express = require("express");
const router = express.Router();
const searchC = require("../controllers/search.c");

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
});

router.get("/", searchC.search);

module.exports = router;