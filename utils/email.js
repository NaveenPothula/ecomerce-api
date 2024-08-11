const nodemailer = require('nodemailer');

// Create a transporter object
let transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

console.log(process.env.EMAIL, process.env.PASSWORD);

// Define the email sending function
const sendEmail = (to, subject, text, html) => {
  let mailOptions = {
    from: `Naveen Pothula <${process.env.EMAIL}>`,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
