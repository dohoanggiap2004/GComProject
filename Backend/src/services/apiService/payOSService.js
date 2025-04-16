const Transaction = require('../../app/models/Transaction')
const User = require('../../app/models/User')
const mongoose = require("mongoose");

const updateStatusAndUserService = async (orderCode, status, user) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // 1. Cập nhật transaction status
        const transaction = await Transaction.findOneAndUpdate(
            { orderCode },
            { $set: { status } },
            { new: true, session }
        );

        if (!transaction) {
            throw new Error("Transaction not found");
        }

        // 2. Cập nhật user (service + serviceExpiry)
        const now = new Date();

        const updatedUser = await User.findByIdAndUpdate(
            transaction.userId,
            [
                {
                    $set: {
                        service: user.service,
                        serviceExpiry: {
                            $cond: {
                                if: { $gt: ['$serviceExpiry', now] },
                                then: { $add: ['$serviceExpiry', 30 * 24 * 60 * 60 * 1000] },
                                else: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
                            }
                        }
                    }
                }
            ],
            { new: true, session }
        );


        if (!updatedUser) {
            throw new Error("User not found");
        }

        // 3. Commit transaction
        await session.commitTransaction();
        session.endSession();

        return {
            transaction,
            user: updatedUser,
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};


const getTransactionByOrderCode = async (orderCode) => {
    return Transaction.findOne({
        orderCode,
    }).lean()
}

module.exports = {
    getTransactionByOrderCode,
    updateStatusAndUserService
}

