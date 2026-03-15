const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM('admin', 'owner', 'user'),
            defaultValue: 'user'
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: true
        },
        otpExpires: {
            type: DataTypes.DATE,
            allowNull: true
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        verificationToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastIp: {
            type: DataTypes.STRING,
            allowNull: true
        },
        deviceType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        deviceName: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    return User;
};
