const express = require("express");
const passport = require("passport");
const router = express.Router();
//controller
const AuthenticationController = require("../app//controllers/AuthenticationController");
const RefreshToken = require("../app/models/RefreshToken");
const User = require("../app/models/User");
const bcrypt = require("bcrypt");

router.post('/register', async (req, res) => {
    const {email, password, ...userInfo} = req.body;

    try {
        console.log('check email', email)
        // Kiểm tra xem người dùng đã tồn tại chưa
        const user = await User.findOne({ email: email });
        console.log(user);
        if (user) {
            return res.status(400).send('Username already exists');
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Lưu người dùng mới vào cơ sở dữ liệu
        const newUser = new User({
            email: email,
            password: hashedPassword,
            ...userInfo,
        });

        await newUser.save();
        console.log('User registered successfully');
        res.status(201).send('User registered successfully');
    } catch (err) {
        console.log('Error registering user:', err);
        res.status(500).send('Server error');
    }
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline", // Đảm bảo lấy refresh token
    prompt: "consent",
  })
);

router.get(
  "/google/redirect",
  AuthenticationController.authenticateGoogle
);

router.get("/google/failure", (req, res) => {
  res.send("Oops! Something went wrong. 😢");
});

// login local
router.post("/login", AuthenticationController.authenticateLocal);

//login admin
router.post("/admin/login", AuthenticationController.authenticateLocalAdmin);

//logout
router.post("/logout", async (req, res, next) => {

    try {
        if (req.cookies.refreshToken) {
            const refreshToken = req.cookies.refreshToken;

            // Delete refresh token from the database
            await RefreshToken.deleteOne({ token: refreshToken });
        }

        // Clear the refresh token from the cookies first
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "Strict",
            secure: true, // Use secure only in production with HTTPS
        });
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "Strict",
            secure: true, // Use secure only in production with HTTPS
        });

        res.status(201).json({
            mes: "Logout successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mes: "Internal server error",
        });
    }

});

module.exports = router;
