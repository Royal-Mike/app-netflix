const passport = require("passport");
const { Strategy } = require("passport-strategy");

module.exports = class MyStrategy extends Strategy {
  constructor(verify, options) {
    super();
    this.name = "myStrategies";
    this.verify = verify;
    this.username = options && options.username ? options.username : "username";
    this.password = options && options.password ? options.password : "password";
    passport.strategies[this.name] = this;
  }

  authenticate(req, options) {
    const un = req.body[this.username];
    const pw = req.body[this.password];;
    this.verify(un, pw, (err, user) => {
      if (err) {
        return this.fail(err);
      }
      if (user) {
        return this.success(user, null);
      }
      this.fail("invalid auth");
    });
  }
};