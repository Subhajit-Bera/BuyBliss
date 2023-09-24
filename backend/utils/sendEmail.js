const nodeMailer = require("nodemailer");

// SMTP Simple Mail Transfer Protocol
const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    //Reason we need host and port here: https://www.npmjs.com/package/nodemailer
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,

    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject, 
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
