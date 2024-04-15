const express = require("express");
const router = express.Router();
const adminC = require("../controllers/admin.c");

router.use((req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "admin") {
        return next();
    }
    res.redirect("/");
});

router.get('/', adminC.home);

router.post('/getmovie', adminC.getMovies);
router.post('/addmovie', adminC.addMovie);
router.post('/updatemovie', adminC.updateMovie)
router.post('/deletemovie', adminC.deleteMovie);

router.post('/getgenre', adminC.getGenres);
router.post('/addgenre', adminC.addGenre);
router.post('/updategenre', adminC.updateGenre);
router.post('/deletegenre', adminC.deleteGenre);

router.post('/getuser', adminC.getUsers);
router.post('/adminuser', adminC.adminUser);
router.post('/deleteuser', adminC.deleteUser);

// router.post('/getpro', adminC.getPro);
// router.post('/updpro', adminC.updatePro);
// router.post('/addpro', adminC.addPro);
// router.post('/delpro', adminC.deletePro);

module.exports = router;