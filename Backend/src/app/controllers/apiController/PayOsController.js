const { payos } = require('../../../config/payos');
const {isValidSignature} = require("../../../utils/checkCheckSumKey");
const getUserIdFromToken = require("../../../utils/getUserIdFromToken");
const {updateStatusAndUserService, getTransactionByOrderCode} = require("../../../services/apiService/payOSService");
const {createWebhookService} = require("../../../services/apiService/webhookService");


class PayOsController {
    async createPaymentLink(req, res) {
        try {
            const reqData = req.body;
            if (!reqData) {
                return res.status(400).json({ message: 'Invalid productsInfo in request body' });
            }

            const expiredAt = Math.floor(Date.now() / 1000) + 3600;

            const items = [{
                name: 'Premium Plan',
                quantity:  1,
                price: 250000,
            }]

            // Dữ liệu gửi lên PayOS
            const requestData = {
                orderCode: reqData.orderCode,
                amount: reqData.amount,
                // amount: 5000,
                description: `Paying for GCom's Premium`,
                items: items,
                cancelUrl: "http://localhost:3000/pricing",
                returnUrl: "http://localhost:3000",
                expiredAt,
            };

            // Tạo link thanh toán
            const paymentLink = await payos.createPaymentLink(requestData);

            return res.status(200).json({ checkoutUrl: paymentLink.checkoutUrl });
        } catch (error) {
            console.error('Create payment link error:', error);
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }


    async ReceiveWebhook(req, res) {
        try {
            const { data, signature } = req.body;

            if (!data || !signature) {
                return res.status(400).json({ message: "Missing data, signature, or userId" });
            }
            //validate signature
            const valid = isValidSignature(data, signature, process.env.PAYOS_CHECKSUM_KEY);
            if (!valid) {
                return res.status(403).json({ message: "Invalid signature" });
            }
            await createWebhookService({
                ...data,
                success: req.body.success
            })

            const transaction = await getTransactionByOrderCode(data.orderCode);
            if (!transaction) {
                return res.status(404).json({ message: "Transaction not found" });
            }

            // Kiểm tra trạng thái thành công và đúng số tiền
            if (req.body.success === true && transaction.amount === data.amount) {
                const userUpdate = {
                    service: 'premium',
                    serviceExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                };

                // Cập nhật cả status và user bằng transaction
                await updateStatusAndUserService(data.orderCode, 'PAID', userUpdate);

                return res.status(200).json({ message: "Transaction and user updated successfully" });
            } else {
                return res.status(400).json({ message: "Transaction not valid or not successful" });
            }
        } catch (error) {
            console.error("Error in ReceiveWebhook:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }


}

module.exports = new PayOsController();
