const { payos } = require('../../../config/payos');
const { isValidSignature } = require("../../../utils/checkCheckSumKey");
const { updateStatusAndUserService, getTransactionByOrderCode } = require("../../../services/apiService/payOSService");
const { createWebhookService } = require("../../../services/apiService/webhookService");
require('dotenv').config();
class PayOsController {
    async createPaymentLink(req, res) {
        try {
            const reqData = req.body;
            if (!reqData?.orderCode || !reqData?.amount) {
                return res.status(400).json({
                    error: 1,
                    message: 'Order code and amount are required'
                });
            }

            const expiredAt = Math.floor(Date.now() / 1000) + 3600;

            const items = [{
                name: 'Premium Plan',
                quantity: 1,
                price: 250000,
            }];

            // Dữ liệu gửi lên PayOS
            const requestData = {
                orderCode: reqData.orderCode,
                amount: reqData.amount,
                description: `Paying for GCom's Premium`,
                items: items,
                cancelUrl: `${process.env.CLIENT_URL}/pricing`,
                returnUrl: `${process.env.CLIENT_URL}`,
                expiredAt,
            };

            // Tạo link thanh toán
            const paymentLink = await payos.createPaymentLink(requestData);

            return res.status(200).json({
                error: 0,
                data: { checkoutUrl: paymentLink.checkoutUrl },
                message: 'Payment link created successfully'
            });
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: 'Internal Server Error'
            });
        }
    }

    async ReceiveWebhook(req, res) {
        try {
            const { data, signature } = req.body;

            if (!data || !signature) {
                return res.status(400).json({
                    error: 1,
                    message: "Missing data or signature"
                });
            }

            // Validate signature
            const valid = isValidSignature(data, signature, process.env.PAYOS_CHECKSUM_KEY);
            if (!valid) {
                return res.status(403).json({
                    error: 1,
                    message: "Invalid signature"
                });
            }

            await createWebhookService({
                ...data,
                success: req.body.success
            });

            const transaction = await getTransactionByOrderCode(data.orderCode);
            if (!transaction) {
                return res.status(404).json({
                    error: 1,
                    message: "Transaction not found"
                });
            }

            // Kiểm tra trạng thái thành công và đúng số tiền
            if (req.body.success === true && transaction.amount === data.amount) {
                const userUpdate = {
                    service: 'premium',
                    serviceExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                };

                // Cập nhật cả status và user bằng transaction
                const updateResult = await updateStatusAndUserService(data.orderCode, 'PAID', userUpdate);

                return res.status(200).json({
                    error: 0,
                    data: updateResult,
                    message: "Transaction and user updated successfully"
                });
            } else {
                return res.status(400).json({
                    error: 1,
                    message: "Transaction not valid or not successful"
                });
            }
        } catch (error) {
            return res.status(500).json({
                error: 1,
                message: "Internal Server Error"
            });
        }
    }
}

module.exports = new PayOsController();
