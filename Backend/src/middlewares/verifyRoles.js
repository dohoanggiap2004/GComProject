const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        // console.log('check user role', userRole);
        if (!userRole) return res.sendStatus(401);

        if (!allowedRoles.includes(userRole)) {
            return res.sendStatus(403); // Forbidden nếu vai trò không hợp lệ
        }

        // console.log('verify role successfully')
        next();
    };
};

module.exports = verifyRoles;
