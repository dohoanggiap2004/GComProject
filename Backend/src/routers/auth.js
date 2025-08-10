const express = require("express");
const passport = require("passport");
const router = express.Router();
//controller
const AuthenticationController = require("../app//controllers/AuthenticationController");
const RefreshToken = require("../app/models/RefreshToken");
const User = require("../app/models/User");
const bcrypt = require("bcrypt");

router.post('/register', async (req, res) => {
    const {email, password, confirmPassword, ...userInfo} = req.body;
    try {
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Confirm password does not match!' });
        }
        // Kiểm tra xem người dùng đã tồn tại chưa
        const user = await User.findOne({ email: email });
        // console.log(user);
        if (user) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Lưu người dùng mới vào cơ sở dữ liệu
        const newUser = new User({
            ...userInfo,
            email: email,
            password: hashedPassword,
        });

        await newUser.save();
        // console.log('User registered successfully');
        res.status(201).send('User registered successfully');
    } catch (err) {
        // console.log('Error registering user:', err);
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
            await RefreshToken.deleteOne({ token: refreshToken });
        }

        // Clear the refresh token from the cookies first
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });
        res.clearCookie("accessToken", {
            httpOnly: false,
            sameSite: "None",
            secure: true,
        });

        res.status(201).json({
            mes: "Logout successfully",
        });

    } catch (error) {
        // console.log(error);
        res.status(500).json({
            mes: "Internal server error",
        });
    }
});

module.exports = router;
