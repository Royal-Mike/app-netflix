const express = require("express");
const router = express.Router();
const passport = require("passport");
const accountC = require("../controllers/account.c");

router.post("/signup-submit", accountC.signup);
router.post("/login", passport.authenticate("myStrategies", { failureRedirect: "/", failureFlash: true, }),
	(req, res) => {
		req.flash("success", "Login successful!");

		if (req.user.role === "admin") {
			res.redirect("/admin");
		}
		else {
			req.session.username = req.body.username;
			
			res.redirect("/home");
		}
	}
);

module.exports = router;