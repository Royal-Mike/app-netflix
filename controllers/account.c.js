const accountM = require("../models/account.m");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
    signup: async (req, res, next) => {
        try {
            const un = req.body.username;
            const email = req.body.email;
            const fn = req.body.fullname;
            const dob = req.body.dob;
            const pw = req.body.password;
            const role = "user";

            const existingUser = await accountM.getAccount(un);
            const existingEmail = await accountM.getEmail(email);

            if (existingUser && existingEmail && existingEmail.email === email) {
                req.flash("unValue", "");
                req.flash("emailValue", "");
                req.flash("fnValue", fn);
                req.flash("dobValue", dob);
                req.flash("pwValue", pw);
                req.flash(
                    "errorUser",
                    "Tên người dùng đã tồn tại. Vui lòng chọn tên khác!"
                );
                req.flash("errorEmail", "Email đã tồn tại. Vui lòng chọn email khác!");
                return res.redirect("/signup");
            }
            else if (existingUser) {
                req.flash("emailValue", email);
                req.flash("fnValue", fn);
                req.flash("dobValue", dob);
                req.flash("pwValue", pw);
                req.flash(
                    "errorUser",
                    "Tên người dùng đã tồn tại. Vui lòng chọn tên khác!"
                );
                return res.redirect("/signup");
            }
            else if (existingEmail && existingEmail.email === email) {
                req.flash("unValue", un);
                req.flash("fnValue", fn);
                req.flash("dobValue", dob);
                req.flash("pwValue", pw);
                req.flash("errorEmail", "Email đã tồn tại. Vui lòng chọn email khác!");
                return res.redirect("/signup");
            }

            bcrypt.hash(pw, saltRounds, async function (err, hash) {
                if (err) return next(err);
                await accountM.createAccount(new accountM(un, email, fn, dob, hash, role));
                req.flash("success", "Tạo tài khoản thành công!");
                res.redirect("/");
            });
        } catch (error) {
            throw error;
        }
    }
};
