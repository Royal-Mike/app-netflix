const accountM = require("../models/account.m");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
    signup: async (req, res, next) => {
        try {
            const un = req.body.username;
            const em = req.body.email;
            const dob = req.body.dob;
            const pw = req.body.password;
            const role = "user";

            const existingUser = await accountM.getAccount(un);
            const existingEmail = await accountM.getEmail(em);

            if (existingUser) {
                req.flash("unValue", "");
                req.flash("emailValue", em);
                req.flash("dobValue", dob);
                req.flash("pwValue", pw);
                req.flash("errorUser", "Username already exists.");
                return res.redirect("/signup");
            }
            else if (existingEmail) {
                req.flash("unValue", un);
                req.flash("emailValue", "");
                req.flash("dobValue", dob);
                req.flash("pwValue", pw);
                req.flash("errorEmail", "Email already exists.");
                return res.redirect("/signup");
            }

            bcrypt.hash(pw, saltRounds, async function (err, hash) {
                if (err) return next(err);
                await accountM.createAccount(new accountM(un, em, dob, hash, role));
                req.flash("success", "Account created!");
                res.redirect("/");
            });
        } catch (error) {
            throw error;
        }
    }
};
