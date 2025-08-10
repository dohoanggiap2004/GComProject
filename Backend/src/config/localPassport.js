const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../app/models/User");
const localPassport = () => {
    passport.use(
        new LocalStrategy({
            usernameField: "email", passwordField: "password",
        }, async function verify(email, password, done) {
            try {
                // console.log('check email', email)
                // console.log('check password', password)
                const user = await User.findOne({email: email});
                // console.log('check user', user)
                if (!user) return done(null, false, {message: "Incorrect email or password"});
                // console.log('check user', user)
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) return done(null, false, {message: "Wrong password"});

                return done(null, user);
            } catch (error) {
                console.log(error);
            }
        })
    );
};

module.exports = localPassport;
