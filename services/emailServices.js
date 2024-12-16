const nodemailer = require("nodemailer");
require("dotenv").config();

class EmailService {
  constructor() {
    // Inițializarea transportului pentru trimiterea email-urilor folosind Nodemailer
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Adresa de email
        pass: process.env.EMAIL_PASS, // Parola sau App Password pentru Gmail
      },
    });
  }

  // Template pentru email-ul OTP (verificare cod)
  getOTPTemplate(otp) {
    return {
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Email Verification</h1>
          <div style="background-color: #f8f8f8; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="font-size: 16px;">Your verification code is:</p>
            <h2 style="text-align: center; color: #4CAF50; letter-spacing: 5px; padding: 10px;">
              ${otp}
            </h2>
            <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
          </div>
          <p style="color: #999; font-size: 12px; text-align: center;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `,
    };
  }

  // Template pentru email-ul de bun venit
  getWelcomeTemplate(userName) {
    return {
      subject: "Welcome to SlimMom!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FC842D; text-align: center;">Welcome, ${userName}!</h1>
          <p style="font-size: 16px; text-align: center;">
            We're excited to have you on board. Start your health journey now!
          </p>
          <div style="text-align: center; margin: 30px;">
            <a href="https://slimmom-backend-v2.onrender.com/login" 
               style="background-color: #FC842D; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
              Get Started
            </a>
          </div>
          <p style="color: #999; font-size: 12px; text-align: center;">
            Thank you for joining SlimMom!
          </p>
        </div>
      `,
    };
  }

  // Metodă generică pentru trimiterea email-urilor
  async sendEmail(to, template) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: template.subject,
        html: template.html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully to ${to}: ${result.messageId}`);
      return true;
    } catch (error) {
      console.error(`❌ Error sending email to ${to}:`, error.message);
      return false;
    }
  }

  // Trimitere OTP (verificare)
  async sendOTPEmail(email, otp) {
    const template = this.getOTPTemplate(otp);
    return await this.sendEmail(email, template);
  }

  // Trimitere email de bun venit
  async sendWelcomeEmail(email, userName) {
    const template = this.getWelcomeTemplate(userName);
    return await this.sendEmail(email, template);
  }
}

module.exports = new EmailService();
