const mailSenderService = require('../../../services/mailService');

const sendMail = (req, res) => {
    try {
        const { userInfo, cardInfo } = req.body;

        // Kiểm tra dữ liệu
        if (!userInfo || !cardInfo) {
            return res.status(400).json({
                error: 1,
                message: 'User and card information are required'
            });
        }

        // Gửi email
        const result = mailSenderService({ userInfo, cardInfo });

        return res.status(200).json({
            error: 0,
            data: result,
            message: 'Email sent successfully'
        });
    } catch (error) {
        return res.status(500).json({
            error: 1,
            message: 'Internal Server Error'
        });
    }
};

module.exports = {
    sendMail,
};
