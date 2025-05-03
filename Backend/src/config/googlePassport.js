const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require('../app/models/User')

require("dotenv").config();
const googlePassport = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CB,
                accessType: 'offline', // Bắt buộc để nhận refreshToken
                prompt: 'consent',
            },
            async (accessToken, refreshToken, profile, cb) => {
                try {
                    const user = await User.findOneAndUpdate(
                        { email: profile.emails[0].value }, // Search condition
                        {
                            $setOnInsert: {  // Only set these fields if a new document is inserted
                                fullname: profile.displayName,
                                password: 'N/A', // Placeholder since password might not be used in OAuth
                                dob: null,
                                phoneNumber: null,
                            },
                        },
                        {
                            upsert: true,   // Create a new doc if one doesn't exist
                            new: true,      // Return the modified document rather than the original
                            setDefaultsOnInsert: true, // Apply schema defaults if a new document is created
                        }
                    );
                    return cb(null, user);
                } catch (error) {
                    // console.log(error)
                    return cb(error, null);
                }
            }
        )
    );
};

module.exports = googlePassport;
