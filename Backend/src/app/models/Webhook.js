const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({
    orderCode: Number,
    amount: Number,
    accountNumber: String,
    counterAccountNumber: String,
    counterAccountName: String,
    transactionDateTime: Date,
    reference: String,
    paymentLinkId: String,
    currency: String,
    description: String,
    code: String,
    desc: String,
    success: Boolean,
    receivedAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Webhook', webhookSchema);
