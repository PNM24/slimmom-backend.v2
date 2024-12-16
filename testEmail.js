require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: "catalin.es@hotmail.com", // Înlocuiește cu o adresă de test
  subject: "Test Email",
  text: "This is a test email from SlimMom Backend!",
})
  .then(info => {
    console.log("Email sent successfully:", info.response);
  })
  .catch(err => {
    console.error("Error sending email:", err.message);
  });
