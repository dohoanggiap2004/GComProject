const {generateAccessToken, generateRefreshToken} = require('../../services/generateTokenService')
const passport = require('passport')
const RefreshToken = require('../../app/models/RefreshToken')
class Authentication {
  //google oauth redirect
  async authenticateGoogle(req, res, next) {
    passport.authenticate("google", async (err, user, info) => {
      if (err) {
        console.log("Error during authentication:", err);
        return next(err);
      }
      if (!user) {
        console.log("Authentication failed:", info);
        return res.status(404).send(info);
      }

      console.log("User authenticated successfully:", user);

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
          sameSite: "Strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("accessToken", accessToken, {
          httpOnly: false,
          secure: false,
          sameSite: "Strict",
          maxAge: 15 * 60 * 1000,
        });
        return res.redirect('http://localhost:3000/');
      } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error saving refresh token" }); // Handle errors properly
      }
    })(req, res, next);
  }

  authenticateLocal(req, res, next) {
    console.log("Authentication local:");
    console.log("Request body:", req.body);
    passport.authenticate("local", async (err, user, info) => {
      if (err) {
        console.log("Error during authentication:", err);
        return next(err);
      }
      if (!user) {
        console.log("Authentication failed:", info);
        return res.status(404).send(info); // Error message sent here
      }
      console.log("User authenticated successfully:", user);

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
          httpOnly: true, // Cookie chỉ được gửi qua HTTP (không thể truy cập qua JavaScript)
          secure: true, // Chỉ gửi cookie qua HTTPS
          sameSite: "Strict", // Ngăn tấn công CSRF
          maxAge: 7 * 24 * 60 * 60 * 1000, // Thời gian sống của cookie (7 ngày)
        });
        res.cookie("accessToken", accessToken, {
          httpOnly: false, // cho phép truy cập qua JavaScript)
          secure: false,
          sameSite: "Strict", // Ngăn tấn công CSRF
          maxAge: 15 * 60 * 1000, // Thời gian sống của cookie 15 phut
        });
        res.status(200).json({
          error: 0
        })

      } catch (error) {
        console.log(error);
      }
    })(req, res, next);
  }

  authenticateLocalAdmin(req, res, next) {
    passport.authenticate("local", async (err, user, info) => {
      if (err) {
        console.log("Error during authentication:", err);
        return next(err);
      }
      if (!user) {
        console.log("Authentication failed:", info);
        return res.status(404).send(info); // Error message sent here
      }
      if (user.role !== 'admin') {
        console.log('user role not match admin')
        return res.status(401).send('Unauthorized');
      }
      console.log("User authenticated successfully:", user);

      try {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const refreshTokenDoc = new RefreshToken({
          token: refreshToken,
          userId: user._id,
        });
        await refreshTokenDoc.save();
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true, // Cookie chỉ được gửi qua HTTP (không thể truy cập qua JavaScript)
          secure: true, // Chỉ gửi cookie qua HTTPS
          sameSite: "Strict", // Ngăn tấn công CSRF
          maxAge: 7 * 24 * 60 * 60 * 1000, // Thời gian sống của cookie (7 ngày)
        });
        res.cookie("accessToken", accessToken, {
          httpOnly: false, // cho phép truy cập qua JavaScript)
          secure: false,
          sameSite: "Strict", // Ngăn tấn công CSRF
          maxAge: 15 * 60 * 1000, // Thời gian sống của cookie 15 phut
        });
        res.status(200).json({
          error: 0
        })
      } catch (error) {
        console.log(error);
      }
    })(req, res, next);
  }
}

module.exports = new Authentication()
