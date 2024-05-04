const express = require("express");
const router = express.Router();
const likedListC = require("../controllers/likedList.c");

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
});

router.get("/", likedListC.getList);

module.exports = router;