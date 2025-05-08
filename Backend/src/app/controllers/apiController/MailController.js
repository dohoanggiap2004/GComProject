const { getUserByIdService } = require('../../../services/apiService/userService');
const mailSenderService = require('../../../services/mailService');
const { startOfDay, endOfDay } = require('date-fns');
const Board = require('../../../app/models/Board');


const sendReminderEmails = async () => {
    try {
        const today = new Date();
        const startDate = startOfDay(today);
        const endDate = endOfDay(today);

        const boards = await Board.find({
            'lists.cards.dateReminder': { $gte: startDate, $lte: endDate }
        }).lean();

        let totalMembers = 0;
        let successfulEmails = 0;

        for (const board of boards) {
            for (const list of board.lists || []) {
                for (const card of list.cards || []) {
                    const reminderDate = new Date(card.dateReminder);
                    if (card.dateReminder && reminderDate >= startDate && reminderDate <= endDate) {

                        const emailPromises = (card.memberIds || []).map(async (memberId) => {
                            totalMembers++;
                            try {
                                const user = await getUserByIdService(memberId);
                                if (!user) return;

                                const result = await mailSenderService(user, card);
                                if (result?.success) {
                                    successfulEmails++;
                                }
                            } catch (_) {

                            }
                        });

                        await Promise.all(emailPromises);
                    }
                }
            }
        }

        return {
            success: true,
            totalMembers,
            successfulEmails
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

module.exports = {
    sendReminderEmails
};
