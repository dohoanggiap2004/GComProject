const nodemailer = require('nodemailer');

const mailSenderService = (user, card) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'giapvu4c@gmail.com',
            pass: 'xsbv pyrq ilxp wlow' // Mật khẩu ứng dụng
        }
    });

    const mailOptions = {
        from: 'giapvu4c@gmail.com',
        to: user.email,
        subject: `⏰ Reminder: Task "${card.title}" is nearing its deadline`,
        html: `
      <h2>Hello ${user.fullname},</h2>
      <p>This is a gentle reminder that the following task is approaching its deadline:</p>

      <h3 style="margin-bottom: 4px;">📝 Task: ${card.title}</h3>
      <p><strong>Description:</strong> ${card.description || 'No description provided.'}</p>
      <p><strong>Due Date:</strong> ${new Date(card.dueDate).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        })}</p>

      <br>
      <p>Please make sure to complete it on time to stay on track.</p>
      <p>If you've already finished this task, you can safely ignore this message.</p>

      <br>
      <p>Best regards,</p>
      <p><strong>Your Task Management Assistant</strong></p>
      <hr>
      <p style="font-size: 12px; color: gray;">This is an automated reminder. Do not reply directly to this email.</p>
    `
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject({ success: false, error });
            } else {
                return resolve({ success: true, info });
            }
        });
    });
};

module.exports = mailSenderService;
