const { Resort, User, Booking } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all active resorts (Public)
exports.getAllResorts = async (req, res) => {
    try {
        const { search, category } = req.query;
        let where = { status: 'active' };

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { location: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        if (category && category !== 'All') {
            where.category = category;
        }

        const resorts = await Resort.findAll({ where });
        res.json(resorts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get single resort (Public)
exports.getResortById = async (req, res) => {
    try {
        const resort = await Resort.findByPk(req.params.id);
        if (!resort) return res.status(404).json({ message: 'Resort not found' });
        res.json(resort);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Create a new resort (Owner)
exports.createResort = async (req, res) => {
    try {
        const { name, description, location, pricePerNight, images, category } = req.body;
        const resort = await Resort.create({
            name,
            description,
            location,
            category,
            pricePerNight,
            images,
            ownerId: req.user.id
        });
        res.status(201).json(resort);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get owner's resorts
exports.getOwnerResorts = async (req, res) => {
    try {
        const ownerId = String(req.user.id);
        console.log(`[DEBUG] Fetching resorts for ownerId: ${ownerId}`);
        const resorts = await Resort.findAll({
            where: { ownerId: ownerId }
        });
        resorts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        console.log(`[DEBUG] Found ${resorts.length} resorts for owner`);
        res.json(resorts);
    } catch (error) {
        console.error(`[ERROR] getOwnerResorts:`, error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update resort details (Owner/Admin)
exports.updateResort = async (req, res) => {
    try {
        const resort = await Resort.findByPk(req.params.id);
        if (!resort) return res.status(404).json({ message: 'Resort not found' });

        // Security: Only owner or admin can update
        if (resort.ownerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await resort.update(req.body);
        res.json(resort);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Delete resort (Owner/Admin)
exports.deleteResort = async (req, res) => {
    try {
        const resort = await Resort.findByPk(req.params.id);
        if (!resort) return res.status(404).json({ message: 'Resort not found' });

        // Security: Only owner or admin can delete
        if (resort.ownerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await resort.destroy();
        res.json({ message: 'Resort deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Admin: Get all resorts
exports.adminGetAllResorts = async (req, res) => {
    try {
        const resorts = await Resort.findAll({
            include: [{ model: User, as: 'owner', attributes: ['name', 'email'] }]
        });
        console.log(`[DEBUG] Admin fetching all resorts. Found: ${resorts.length}`);
        res.json(resorts);
    } catch (error) {
        console.error(`[DEBUG] Error in adminGetAllResorts:`, error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Admin: Update resort status
exports.updateResortStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const resort = await Resort.findByPk(req.params.id);
        if (!resort) return res.status(404).json({ message: 'Resort not found' });

        resort.status = status;
        await resort.save();
        res.json(resort);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
