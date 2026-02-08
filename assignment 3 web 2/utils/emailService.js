const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Generate random 6-digit code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification code email
const sendVerificationEmail = async (email, code, name) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'ShopLite'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Registration Confirmation - Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .code { font-size: 32px; font-weight: bold; color: #4CAF50; text-align: center; padding: 20px; background-color: #fff; border: 2px dashed #4CAF50; border-radius: 5px; margin: 20px 0; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
            .warning { color: #f44336; font-size: 14px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ${process.env.APP_NAME || 'ShopLite'}!</h1>
            </div>
            <div class="content">
              <h2>Hello${name ? ', ' + name : ''}!</h2>
              <p>Thank you for registering. To complete your registration and verify your email address, please use the following code:</p>
              
              <div class="code">${code}</div>
              
              <p>Enter this code on the verification page within <strong>10 minutes</strong>.</p>
              
              <p class="warning">If you did not register on our website, please ignore this email.</p>
              
              <div class="footer">
                <p>This is an automated message, please do not reply.</p>
                <p>&copy; 2026 ${process.env.APP_NAME || 'ShopLite'}. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send welcome email after verification
const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'ShopLite'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Registration Complete!</h1>
            </div>
            <div class="content">
              <h2>Congratulations${name ? ', ' + name : ''}!</h2>
              <p>Your account has been successfully activated. You can now enjoy all the features of our service.</p>
              <p>Thank you for choosing ${process.env.APP_NAME || 'ShopLite'}!</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

module.exports = {
  generateVerificationCode,
  sendVerificationEmail,
  sendWelcomeEmail
};
