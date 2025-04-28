const {generateAccessToken, generateRefreshToken} = require('../../services/generateTokenService')
const passport = require('passport')
const RefreshToken = require('../../app/models/RefreshToken')
class Authentication {
  //google oauth redirect
  async authenticateGoogle(req, res, next) {
    passport.authenticate("google", async (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(404).send(info);
      }

      try {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Assuming you have a RefreshToken model
        const refreshTokenDoc = new RefreshToken({
          token: refreshToken,
          userId: user._id, // Use Mongoose's _id
        });
        await refreshTokenDoc.save();

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("accessToken", accessToken, {
          httpOnly: false,
          secure: true,
          sameSite: "None",
          maxAge: 15 * 60 * 1000,
        });
        return res.redirect('http://localhost:3000/');
      } catch (error) {
        return res.status(500).send({ message: "Error saving refresh token" }); // Handle errors properly
      }
    })(req, res, next);
  }

  authenticateLocal(req, res, next) {
    passport.authenticate("local", async (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(404).send(info); // Error message sent here
      }

      try {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        // Assuming you have a RefreshToken model
        const refreshTokenDoc = new RefreshToken({
          token: refreshToken,
          userId: user._id,
        });
        await refreshTokenDoc.save();

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("accessToken", accessToken, {
          httpOnly: false,
          secure: true,
          sameSite: "None",
          maxAge: 15 * 60 * 1000,
        });
        res.status(200).json({
          error: 0,
        })

      } catch (error) {
        console.log(error);
      }
    })(req, res, next);
  }

  authenticateLocalAdmin(req, res, next) {
    passport.authenticate("local", async (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(404).send(info); // Error message sent here
      }
      if (user.role !== 'admin') {
        return res.status(401).send('Unauthorized');
      }

      try {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const refreshTokenDoc = new RefreshToken({
          token: refreshToken,
          userId: user._id,
        });

        await refreshTokenDoc.save();
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("accessToken", accessToken, {
          httpOnly: false,
          secure: true,
          sameSite: "None",
          maxAge: 15 * 60 * 1000,
        });

        res.status(200).json({
          error: 0,
        })
      } catch (error) {
        console.log(error);
      }
    })(req, res, next);
  }
}

module.exports = new Authentication()
