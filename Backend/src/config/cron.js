const { CronJob } = require('cron');
const { sendReminderEmails } = require('../app/controllers/apiController/MailController');

const cronMail = new CronJob('0 0 9 * * *', async () => {
    await sendReminderEmails();
}, null, true, 'Asia/Ho_Chi_Minh');

module.exports = cronMail;
