const { payos } = require('../../../config/payos')
class PayOsController{
    async createPaymentLink(req, res){
        const reqData = req.body;
        if(!reqData) return res.status(400).json({message: 'reqData is required'});
        const expiredAt = Math.floor(Date.now() / 1000) + 3600;
        const items = reqData.productsInfo.map(item => (
            {
                name: item.model,
                quantity: item.quantity,
                price: item.price,
            }
        ))
        const requestData = {
            orderCode: reqData.orderId,
            amount: reqData.amount,
            // amount: 5000,
            description: `Thanh toan don hang ${reqData.orderId}`,
            items: items,
            cancelUrl: "http://localhost:3000/cart",
            returnUrl: "http://localhost:3000",
            expiredAt: expiredAt,
        };
        const paymentlink = await payos.createPaymentLink(requestData);
        res.status(200).json({ checkoutUrl: paymentlink.checkoutUrl})
    }
}

module.exports = new PayOsController();
