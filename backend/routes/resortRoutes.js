const express = require('express');
const router = express.Router();
const resortController = require('../controllers/resortController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', resortController.getAllResorts);

// Owner/Admin routes
router.post('/', protect, authorize('owner', 'admin'), resortController.createResort);
router.get('/my', protect, authorize('owner'), resortController.getOwnerResorts);

// Admin routes
router.get('/all', protect, authorize('admin'), resortController.adminGetAllResorts);

// Dynamic routes (must be last)
router.get('/:id', resortController.getResortById);
router.put('/:id', protect, authorize('owner', 'admin'), resortController.updateResort);
router.delete('/:id', protect, authorize('owner', 'admin'), resortController.deleteResort);
router.patch('/:id/status', protect, authorize('admin'), resortController.updateResortStatus);

module.exports = router;
