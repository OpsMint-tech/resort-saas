const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendOTPEmail } = require('../utils/emailHelper');
const { Op } = require('sequelize');
const useragent = require('useragent');

// Register User
exports.register = async (req, res) => {
    console.log('Registration request received:', req.body);
    try {
        let { name, email, password, role, phone } = req.body;

        // Security: Lock down Administrative roles
        if (role === 'admin') {
            const adminSecret = req.headers['x-admin-secret'];
            if (adminSecret !== process.env.ADMIN_REGISTRATION_SECRET) {
                return res.status(403).json({ message: 'Unauthorized: Invalid Admin Registration Secret' });
            }
        }

        // Default to user if no role is provided or if someone tries to inject a weird role
        if (!['admin', 'owner', 'user'].includes(role)) {
            role = 'user';
        }

        // Check if user exists
        let user = await User.findOne({ where: { email } });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP and Token
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Production Grade: Admin users are one-time and auto-verified
        const isVerified = role === 'admin';

        // Create user
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: role || 'user',
            otp: isVerified ? null : otp,
            verificationToken: isVerified ? null : verificationToken,
            otpExpires: isVerified ? null : otpExpires,
            isVerified
        });

        // Send OTP/Link only for non-admin users
        if (!isVerified) {
            console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
            try {
                await sendOTPEmail(email, otp, verificationToken);
            } catch (err) {
                console.warn('Failed to send email, but user can still verify with logged OTP above.');
            }
            return res.status(201).json({ message: 'User registered. Please verify your email.' });
        }

        res.status(201).json({ message: 'Admin account created successfully. You can login now.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({
            where: {
                email,
                otp,
                otpExpires: { [Op.gt]: new Date() }
            }
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.json({ message: 'Email verified successfully. You can now login.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify via Link
exports.verifyLink = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({
            where: {
                verificationToken: token,
                otpExpires: { [Op.gt]: new Date() }
            }
        });

        if (!user) {
            return res.status(400).send('<h1>Verification failed</h1><p>Invalid or expired link.</p>');
        }

        user.isVerified = true;
        user.otp = null;
        user.verificationToken = null;
        user.otpExpires = null;
        await user.save();

        res.send('<h1>Verification successful!</h1><p>You can now close this tab and login to your account.</p>');
    } catch (error) {
        res.status(500).send('<h1>Error during verification</h1>');
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isVerified) return res.status(401).json({ message: 'Please verify your email first' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Collect Device and IP Info
        const agent = useragent.parse(req.headers['user-agent']);
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        user.lastIp = ip;
        user.deviceType = agent.device.toString() !== 'Other 0.0.0' ? agent.device.toString() : agent.os.toString();
        user.deviceName = agent.toAgent();
        await user.save();

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
