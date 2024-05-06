const express = require("express");
const router = express.Router();
const listC = require("../controllers/list.c");

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
});

router.get("/", listC.getList);

module.exports = router;