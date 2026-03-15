const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, optionalProtect, authorize } = require('../middlewares/authMiddleware');

// User routes - allows guests
router.post('/', optionalProtect, bookingController.createBooking);
router.get('/my', protect, bookingController.getMyBookings);

// Owner routes
router.get('/owner/sales', protect, authorize('owner'), bookingController.getOwnerSales);
router.get('/owner/dashboard', protect, authorize('owner'), bookingController.getOwnerDashboard);
router.patch('/:id/status', protect, authorize('owner', 'admin'), bookingController.updateBookingStatus);

// Admin routes
router.get('/admin/sales', protect, authorize('admin'), bookingController.getAllSales);
router.get('/admin/dashboard', protect, authorize('admin'), bookingController.getDashboardStats);

module.exports = router;
