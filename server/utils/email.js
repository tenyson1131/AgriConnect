const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      // text,
      html,
    });
  } catch (error) {
    console.log("error sending email", error);
  }
};

const sendOTPEmail = async (email, otp) => {
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AgriConnect - Verify Your Email</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f6f9;
        }
        .email-container {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 30px;
            text-align: center;
        }
        .logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }
        .logo-icon {
            width: 40px;
            height: 40px;
            margin-right: 10px;
            fill: #2ecc71;
        }
        .logo-text {
            font-size: 24px;
            font-weight: bold;
            color: #2ecc71;
        }
        .otp-code {
            background-color: #2ecc71;
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-size: 24px;
            letter-spacing: 3px;
            display: inline-block;
            margin: 20px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="logo-container">
            <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66 1-2.72M20 14.35c-2.72 1.45-4.5 1.65-4.5 1.65-5.92 2.42-5.5 7-5.5 7h10c0-3.5-2-6-2-6 2.5-1.5 4-3.85 4-3.85z"/>
            </svg>
            <span class="logo-text">AgriConnect</span>
        </div>
        
        <h1 style="color: #2ecc71;">Verify Your Email</h1>
        
        <p>Welcome to AgriConnect! To complete your signup, please use the following One-Time Password (OTP):</p>
        
        <div class="otp-code">${otp}</div>
        
        <p>This OTP is valid for 5 minutes. Do not share this code with anyone.</p>
        
        <p>If you did not request this OTP, please ignore this email or contact our support team.</p>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} AgriConnect. All rights reserved.</p>
            <p>Empowering Agriculture, Connecting Farmers</p>
        </div>
    </div>
</body>
</html>
  `;

  const subject = "Verify Your AgriConnect Account";

  await sendEmail(email, subject, htmlTemplate);
};

module.exports = { sendEmail, sendOTPEmail };
