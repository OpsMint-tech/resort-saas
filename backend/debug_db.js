const { sequelize } = require('./models');

async function check() {
    try {
        const [results] = await sequelize.query("DESCRIBE Bookings");
        console.log("Bookings table columns:");
        console.log(results.map(r => r.Field).join(", "));

        const [resortResults] = await sequelize.query("DESCRIBE Resorts");
        console.log("Resorts table columns:");
        console.log(resortResults.map(r => r.Field).join(", "));

        process.exit(0);
    } catch (err) {
        console.error("Error checking columns:", err);
        process.exit(1);
    }
}

check();
