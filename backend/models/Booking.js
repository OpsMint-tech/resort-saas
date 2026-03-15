const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Booking = sequelize.define('Booking', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        checkIn: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        checkOut: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        guests: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
            defaultValue: 'pending'
        },
        guestName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        guestEmail: {
            type: DataTypes.STRING,
            allowNull: true
        },
        guestPhone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        resortId: {
            type: DataTypes.UUID,
            allowNull: false
        }
    });

    return Booking;
};
