const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    }
);

const User = require('./User')(sequelize);
const Resort = require('./Resort')(sequelize);
const Booking = require('./Booking')(sequelize);

// Associations
User.hasMany(Resort, { foreignKey: 'ownerId', as: 'ownedResorts' });
Resort.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Resort.hasMany(Booking, { foreignKey: 'resortId', as: 'bookings' });
Booking.belongsTo(Resort, { foreignKey: 'resortId', as: 'resort' });

module.exports = {
    sequelize,
    User,
    Resort,
    Booking
};
