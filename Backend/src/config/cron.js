const { CronJob } = require('cron');
const { sendReminderEmails } = require('../app/controllers/apiController/MailController');
const {checkServiceExpiry} = require("../services/apiService/userService");

const cronMail = new CronJob('0 0 9 * * *', async () => {
    await sendReminderEmails();
}, null, true, 'Asia/Ho_Chi_Minh');

const cronCheckUserService = new CronJob(
    '0 0 0 * * *',
    async () => {
        await checkServiceExpiry();
    },
    null,
    true,
    'Asia/Ho_Chi_Minh'
);


module.exports = { cronMail, cronCheckUserService };
