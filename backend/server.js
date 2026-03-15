const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', limiter);

// Basic Route
app.get('/', (req, res) => {
    res.send('Resort Booking API is running...');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const resortRoutes = require('./routes/resortRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/resorts', resortRoutes);
app.use('/api/bookings', bookingRoutes);


const PORT = process.env.PORT || 5001;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync models
        await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
