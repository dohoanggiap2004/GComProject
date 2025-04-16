const mongoose = require('mongoose');
const Counter = require('./Counter');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'PAID', 'CANCELLED', 'EXPIRED'],
        default: 'PENDING',
    },
    planType:{
        type: String,
        enum: ['Premium'],
        default: 'Premium',
    },
    orderCode: {
        type: Number,
    },
    amount: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

transactionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

transactionSchema.pre('save', async function (next) {
    const doc = this;

    doc.updatedAt = Date.now();

    if (!doc.isNew) return next();

    try {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'transaction_orderCode' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        doc.orderCode = counter.seq;
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);
