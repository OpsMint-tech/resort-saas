const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Resort = sequelize.define('Resort', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pricePerNight: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        images: {
            type: DataTypes.JSON,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'pending'),
            defaultValue: 'pending'
        },
        rating: {
            type: DataTypes.FLOAT,
            defaultValue: 4.5
        },
        category: {
            type: DataTypes.STRING,
            defaultValue: 'Luxury'
        },
        ownerId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        amenities: {
            type: DataTypes.JSON,
            allowNull: true
        }
    });

    return Resort;
};
