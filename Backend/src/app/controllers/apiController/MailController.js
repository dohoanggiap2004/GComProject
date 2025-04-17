const mailSenderService = require('../../../services/mailService'); // Đường dẫn tới file service

const sendMail = (req, res) => {
    try {
        const { userInfo, cardInfo } = req.body;

        // Kiểm tra dữ liệu
        if (!userInfo || !cardInfo) {
            return res.status(400).json({ message: 'Thiếu thông tin người nhận hoặc thẻ' });
        }

        // Gửi email
        mailSenderService({ userInfo, cardInfo });

        res.status(200).json({ message: 'Email đã được gửi thành công!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Lỗi khi gửi email', error: error.message });
    }
};

module.exports = {
    sendMail,
};
