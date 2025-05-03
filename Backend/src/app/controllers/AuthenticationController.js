const {generateAccessToken, generateRefreshToken} = require('../../services/generateTokenService')
const passport = require('passport')
const RefreshToken = require('../../app/models/RefreshToken')
class Authentication {
  //google oauth redirect
  async authenticateGoogle(req, res, next) {
    passport.authenticate("google", async (err, user, info) => {
      if (err) {
        // console.error('Google authentication error:', err);
        return res.status(500).json({
          error: 1,
          message: 'Authentication failed',
          details: err.message
        });
      }

      if (!user) {
        return res.status(401).json({
          error: 1,
          message: info?.message || 'Google authentication failed',
        });
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

        // Redirect to frontend with success parameter
        return res.redirect('http://localhost:3000/auth/success');

      } catch (error) {
        // console.error('Token generation/saving error:', error);
        // Redirect to frontend with error parameter
        return res.redirect('http://localhost:3000/auth/error?message=' + encodeURIComponent('Failed to complete authentication'));
      }
    })(req, res, next);
  }

  authenticateLocal(req, res, next) {
    passport.authenticate("local", async (err, user, info) => {
      if (err) {
        return res.status(500).json({
          error: 1,
          message: 'Internal server error',
          details: err.message
        });
      }
      if (!user) {
        return res.status(401).json({
          error: 1,
          message: info.message || 'Authentication failed'
        });
      }

      try {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const refreshTokenDoc = new RefreshToken({
          token: refreshToken,
          userId: user._id,
        });
        await refreshTokenDoc.save();
        const refreshExpireDate = new Date();
        refreshExpireDate.setDate(refreshExpireDate.getDate() + 7);

        const accessExpireDate = new Date();
        accessExpireDate.setMinutes(accessExpireDate.getMinutes() + 15);

        res.cookie("refreshToken", refreshToken, {
          secure: true,
          sameSite: 'none',
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.cookie("accessToken", accessToken, {
          secure: true,
          sameSite: 'none',
          maxAge: 15 * 60 * 1000,
        });
        res.status(200).json({
          error: 0,
          message: 'Authentication successful'
        });

      } catch (error) {
        return res.status(500).json({
          error: 1,
          message: 'Error during token generation',
          details: error.message
        });
      }
    })(req, res, next);
  }

  authenticateLocalAdmin(req, res, next) {
    passport.authenticate("local", async (err, user, info) => {
      if (err) {
        return res.status(500).json({
          error: 1,
          message: 'Internal server error',
          details: err.message
        });
      }

      if (!user) {
        return res.status(401).json({
          error: 1,
          message: info?.message || 'Invalid credentials'
        });
      }

      if (user.role !== 'admin') {
        return res.status(403).json({
          error: 1,
          message: 'Access denied. Admin privileges required'
        });
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
          message: 'Admin authentication successful',
        });

      } catch (error) {
        return res.status(500).json({
          error: 1,
          message: 'Error generating authentication tokens',
          details: error.message
        });
      }
    })(req, res, next);
  }
}

module.exports = new Authentication()
