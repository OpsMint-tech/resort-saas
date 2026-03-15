const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your preferred service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTPEmail = async (email, otp, token) => {
    const verificationLink = `${process.env.BASE_URL || 'http://localhost:5001'}/api/auth/verify-link?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Resort Booking Account',
        text: `Your OTP is: ${otp}. Or click here to verify: ${verificationLink}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #4CAF50; text-align: center;">Account Verification</h2>
                <p>Thank you for registering! Please use the OTP below or click the button to verify your account.</p>
                <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                    ${otp}
                </div>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Account Now</a>
                </div>
                <p style="font-size: 12px; color: #777; text-align: center;">This link will expire in 10 minutes.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Could not send OTP email');
    }
};

module.exports = {
    sendOTPEmail
};
