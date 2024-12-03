const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Template pentru email-ul de verificare OTP
  getOTPTemplate(otp) {
    return {
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Email Verification</h1>
          <div style="background-color: #f8f8f8; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="font-size: 16px;">Your verification code is:</p>
            <h2 style="text-align: center; color: #4CAF50; letter-spacing: 5px; padding: 10px;">${otp}</h2>
            <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
          </div>
          <p style="color: #999; font-size: 12px; text-align: center;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `
    };
  }

  // Template pentru confirmarea înregistrării
  getWelcomeTemplate(userName) {
    return {
      subject: 'Welcome to SlimMom! 🎉',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Header cu Logo -->
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://your-domain.com/logo.png" alt="SlimMom Logo" style="width: 150px; height: auto;"/>
          </div>
  
          <!-- Titlu Principal -->
          <h1 style="color: #FC842D; text-align: center; font-size: 28px; margin-bottom: 25px;">
            Welcome to Your Health Journey! ✨
          </h1>
  
          <!-- Salut Personalizat -->
          <p style="font-size: 18px; color: #333; line-height: 1.6; margin-bottom: 25px;">
            Hey ${userName}! 👋
          </p>
  
          <!-- Mesaj Principal -->
          <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 30px;">
            We're thrilled to have you join the SlimMom community. Your journey to a healthier lifestyle begins now!
          </p>
  
          <!-- Caracteristici în Cards -->
          <div style="margin: 30px 0;">
            <div style="background: #F8F9FA; border-left: 4px solid #FC842D; padding: 20px; margin-bottom: 15px; border-radius: 5px;">
              <h3 style="color: #FC842D; margin: 0 0 10px 0;">📊 Track Your Progress</h3>
              <p style="color: #666; margin: 0;">Monitor your daily calorie intake with our intuitive tracker</p>
            </div>
  
            <div style="background: #F8F9FA; border-left: 4px solid #FC842D; padding: 20px; margin-bottom: 15px; border-radius: 5px;">
              <h3 style="color: #FC842D; margin: 0 0 10px 0;">🥗 Smart Recommendations</h3>
              <p style="color: #666; margin: 0;">Get personalized food suggestions based on your preferences</p>
            </div>
  
            <div style="background: #F8F9FA; border-left: 4px solid #FC842D; padding: 20px; margin-bottom: 15px; border-radius: 5px;">
              <h3 style="color: #FC842D; margin: 0 0 10px 0;">📱 Easy to Use</h3>
              <p style="color: #666; margin: 0;">Access your dashboard anytime, anywhere</p>
            </div>
          </div>
  
          <!-- Call to Action Button -->
          <div style="text-align: center; margin: 35px 0;">
            <a href="https://your-domain.com/login" 
               style="background-color: #FC842D; 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 25px;
                      font-weight: bold;
                      display: inline-block;
                      text-transform: uppercase;
                      letter-spacing: 1px;">
              Start Your Journey
            </a>
          </div>
  
          <!-- Footer -->
          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 14px;">
              Follow us on social media for daily tips and inspiration
            </p>
            <div style="margin: 15px 0;">
              <!-- Social Media Icons -->
              <a href="#" style="margin: 0 10px; text-decoration: none;">📘 Facebook</a>
              <a href="#" style="margin: 0 10px; text-decoration: none;">📸 Instagram</a>
              <a href="#" style="margin: 0 10px; text-decoration: none;">🐦 Twitter</a>
            </div>
            <p style="color: #888; font-size: 12px; margin-top: 20px;">
              © 2024 SlimMom. All rights reserved.
            </p>
          </div>
        </div>
      `
    };
  }

  // Metodă generică pentru trimiterea email-urilor
  async sendEmail(to, template) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: template.subject,
        html: template.html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Metode specifice pentru diferite tipuri de email-uri
  async sendOTPEmail(email, otp) {
    const template = this.getOTPTemplate(otp);
    return await this.sendEmail(email, template);
  }

  async sendWelcomeEmail(email, userName) {
    const template = this.getWelcomeTemplate(userName);
    return await this.sendEmail(email, template);
  }

  // Metodă pentru verificarea configurării email-ului
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error) {
      console.error('Email service configuration error:', error);
      return false;
    }
  }
}

// Exportăm o singură instanță a serviciului
const emailService = new EmailService();
module.exports = emailService;