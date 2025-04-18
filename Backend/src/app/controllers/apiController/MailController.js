const mailSenderService = require('../../../services/mailService'); // Đường dẫn tới file service

const sendMail = (req, res) => {
    try {
        const { userInfo, cardInfo } = req.body;

        // Kiểm tra dữ liệu
        if (!userInfo || !cardInfo) {
            return res.status(400).json({ message: 'User and card Infomation is required' });
        }

        // Gửi email
        mailSenderService({ userInfo, cardInfo });

        res.status(200).json({ message: 'Mail successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Intenal Server Error' });
    }
};

module.exports = {
    sendMail,
};
