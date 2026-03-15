const { Booking, Resort, User } = require('../models');
const { sequelize } = require('../models');
const { Op } = require('sequelize');

// @desc    Book a resort (User)
exports.createBooking = async (req, res) => {
    try {
        const { resortId, checkIn, checkOut, totalPrice, guests, guestName, guestEmail, guestPhone } = req.body;
        const userId = req.user ? String(req.user.id) : null;

        let profileUser = null;
        if (userId) {
            profileUser = await User.findByPk(userId);
            if (!profileUser) {
                return res.status(401).json({ message: 'Session expired or user not found. Please re-login.' });
            }
        }

        const booking = await Booking.create({
            resortId,
            userId,
            checkIn,
            checkOut,
            totalPrice,
            guests: guests || 1,
            guestName: guestName || (profileUser ? profileUser.name : null),
            guestEmail: guestEmail || (profileUser ? profileUser.email : null),
            guestPhone: guestPhone || (profileUser ? profileUser.phone : null)
        });
        res.status(201).json(booking);
    } catch (error) {
        console.error("[ERROR] createBooking failed:", error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get my bookings (User)
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { userId: req.user.id },
            include: [{ model: Resort, as: 'resort' }],
            order: [['createdAt', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Admin: Get all sales/bookings
exports.getAllSales = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: Resort, as: 'resort' },
                { model: User, as: 'user', attributes: ['name', 'email'] }
            ]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Owner: Get sales for their resorts
exports.getOwnerSales = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                {
                    model: Resort,
                    as: 'resort',
                    where: { ownerId: req.user.id }
                }
            ]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Admin: Dashboard stats (Platform-wide Money Flow & Stats)
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count({ where: { role: 'user' } });
        const totalOwners = await User.count({ where: { role: 'owner' } });
        const totalResorts = await Resort.count();

        // 1. Revenue Breakdown by Status for entire platform
        const statusBreakdown = await Booking.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalAmount']
            ],
            group: ['status'],
            raw: true
        });

        // 2. Platform-wide Money Flow (Recent Transactions)
        const moneyFlow = await Booking.findAll({
            limit: 15, // More for admin
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'totalPrice', 'status', 'checkIn', 'checkOut', 'createdAt', 'guests', 'guestName', 'guestEmail', 'guestPhone'],
            include: [
                {
                    model: Resort,
                    as: 'resort',
                    attributes: ['name']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email', 'phone']
                }
            ]
        });

        // Calculate platform totals
        const totalSales = statusBreakdown.reduce((acc, curr) => acc + parseFloat(curr.totalAmount || 0), 0);
        const confirmedRevenue = statusBreakdown.find(s => s.status === 'confirmed')?.totalAmount || 0;
        const pendingRevenue = statusBreakdown.find(s => s.status === 'pending')?.totalAmount || 0;

        // Calculate total guests
        const totalGuests = await Booking.sum('guests') || 0;

        // 3. New Requirement: Revenue per resort
        const resortRevenue = await Booking.findAll({
            attributes: [
                'resortId',
                [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalAmount'],
                [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'bookingCount']
            ],
            include: [{
                model: Resort,
                as: 'resort',
                attributes: ['name']
            }],
            group: ['resortId', 'resort.id', 'resort.name'],
            raw: true
        });

        // 4. Booking Trend (Last 30 days)
        const bookingTrend = await Booking.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('Booking.createdAt')), 'date'],
                [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalAmount'],
                [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'bookingCount']
            ],
            where: {
                createdAt: { [Op.gt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            },
            group: [sequelize.fn('DATE', sequelize.col('Booking.createdAt'))],
            order: [[sequelize.fn('DATE', sequelize.col('Booking.createdAt')), 'ASC']],
            raw: true
        });

        // 5. Security Audit: Recent Users with IP and Device Info
        const recentLogins = await User.findAll({
            where: { lastIp: { [Op.ne]: null } },
            limit: 20,
            order: [['updatedAt', 'DESC']],
            attributes: ['id', 'name', 'email', 'role', 'lastIp', 'deviceType', 'deviceName', 'updatedAt']
        });

        const deviceBreakdown = await User.findAll({
            attributes: [
                'deviceType',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: { deviceType: { [Op.ne]: null } },
            group: ['deviceType'],
            raw: true
        });

        res.json({
            summary: {
                totalUsers,
                totalOwners,
                totalResorts,
                totalSales,
                confirmedRevenue,
                pendingRevenue,
                totalGuests,
            },
            statusBreakdown,
            bookingTrend: bookingTrend.map(item => ({
                date: item.date,
                amount: parseFloat(item.totalAmount || 0),
                count: item.bookingCount || 0
            })),
            resortRevenue: resortRevenue.map(item => ({
                id: item.resortId,
                name: item['resort.name'] || 'Deleted Resort',
                totalAmount: parseFloat(item.totalAmount || 0),
                count: item.bookingCount || 0
            })),
            moneyFlow: moneyFlow.map(item => ({
                bookingId: item.id,
                resortName: item.resort?.name || 'N/A',
                customer: item.user?.name || item.guestName || 'N/A',
                email: item.user?.email || item.guestEmail || 'N/A',
                phone: item.user?.phone || item.guestPhone || 'N/A',
                amount: item.totalPrice,
                status: item.status,
                guests: item.guests,
                transactionDate: item.createdAt,
                stayPeriod: `${item.checkIn || 'N/A'} to ${item.checkOut || 'N/A'}`
            })),
            security: {
                recentLogins,
                deviceBreakdown
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Owner: Dashboard stats (Detailed Money Flow & Status Breakdown)
exports.getOwnerDashboard = async (req, res) => {
    try {
        const userId = String(req.user.id);

        // 1. Total Resorts owned by this user
        const totalResorts = await Resort.count({ where: { ownerId: userId } });

        // 2. Revenue Breakdown by Status (Confirmed, Pending, etc.)
        const statusBreakdown = await Booking.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalAmount']
            ],
            include: [{
                model: Resort,
                as: 'resort',
                attributes: [],
                where: { ownerId: userId }
            }],
            group: ['Booking.status'],
            raw: true
        });

        // 3. Detailed Money Flow (Recent Transactions)
        const moneyFlow = await Booking.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'totalPrice', 'status', 'checkIn', 'checkOut', 'createdAt', 'guests', 'guestName', 'guestEmail', 'guestPhone'],
            include: [
                {
                    model: Resort,
                    as: 'resort',
                    attributes: ['name'],
                    where: { ownerId: userId }
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email', 'phone']
                }
            ]
        });

        // Calculate totals for quick overview
        const totalRevenue = statusBreakdown.reduce((acc, curr) => acc + parseFloat(curr.totalAmount || 0), 0);
        const confirmedRevenue = statusBreakdown.find(s => s.status === 'confirmed')?.totalAmount || 0;
        const pendingRevenue = statusBreakdown.find(s => s.status === 'pending')?.totalAmount || 0;

        const totalGuests = await Booking.sum('guests', {
            include: [{
                model: Resort,
                as: 'resort',
                where: { ownerId: userId }
            }]
        }) || 0;

        // 4. Revenue per resort for this owner
        const resortRevenue = await Booking.findAll({
            attributes: [
                'resortId',
                [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalAmount'],
                [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'bookingCount']
            ],
            include: [{
                model: Resort,
                as: 'resort',
                where: { ownerId: userId },
                attributes: ['name']
            }],
            group: ['resortId', 'resort.id', 'resort.name'],
            raw: true
        });

        // 5. Owner Booking Trend (Last 30 days)
        const bookingTrend = await Booking.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('Booking.createdAt')), 'date'],
                [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalAmount'],
                [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'bookingCount']
            ],
            include: [{
                model: Resort,
                as: 'resort',
                where: { ownerId: userId },
                attributes: []
            }],
            where: {
                createdAt: { [Op.gt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            },
            group: [sequelize.fn('DATE', sequelize.col('Booking.createdAt'))],
            order: [[sequelize.fn('DATE', sequelize.col('Booking.createdAt')), 'ASC']],
            raw: true
        });

        res.json({
            summary: {
                totalResorts,
                totalRevenue,
                confirmedRevenue,
                pendingRevenue,
                totalGuests,
            },
            statusBreakdown,
            resortRevenue: resortRevenue.map(item => ({
                id: item.resortId,
                name: item['resort.name'] || 'N/A',
                totalAmount: parseFloat(item.totalAmount || 0),
                count: item.bookingCount || 0
            })),
            bookingTrend: bookingTrend.map(item => ({
                date: item.date,
                amount: parseFloat(item.totalAmount || 0),
                count: item.bookingCount || 0
            })),
            moneyFlow: moneyFlow.map(item => ({
                bookingId: item.id,
                resortName: item.resort?.name || 'N/A',
                customer: item.user?.name || item.guestName || 'N/A',
                email: item.user?.email || item.guestEmail || 'N/A',
                phone: item.user?.phone || item.guestPhone || 'N/A',
                amount: item.totalPrice,
                status: item.status,
                guests: item.guests,
                transactionDate: item.createdAt,
                stayPeriod: `${item.checkIn || 'N/A'} to ${item.checkOut || 'N/A'}`
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Owner/Admin: Update booking status (confirm/cancel)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'confirmed', 'cancelled', etc.

        const booking = await Booking.findByPk(id, {
            include: [{ model: Resort, as: 'resort' }]
        });

        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Security check: Only owner of resort or admin
        if (req.user.role === 'owner') {
            if (String(booking.resort.ownerId) !== String(req.user.id)) {
                return res.status(403).json({ message: 'Not authorized to manage this booking' });
            }
        } else if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();

        res.json({ message: `Booking ${status} successfully`, booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
