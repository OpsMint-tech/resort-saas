const { Resort } = require('./models');

async function check() {
    const resorts = await Resort.findAll({ attributes: ['id', 'name'] });
    console.log("Existing Resort IDs:");
    resorts.forEach(r => console.log(`${r.id}: ${r.name}`));
    process.exit(0);
}

check();
