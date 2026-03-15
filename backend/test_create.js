const { Booking, Resort, User } = require('./models');

async function test() {
    try {
        const user = await User.findOne();
        const resort = await Resort.findOne();

        if (!user || !resort) {
            console.error("No user or resort found. Can't test creation.");
            process.exit(1);
        }

        console.log(`Using userId: ${user.id}, resortId: ${resort.id}`);

        const booking = await Booking.create({
            resortId: resort.id,
            userId: user.id,
            checkIn: '2024-11-20',
            checkOut: '2024-11-25',
            totalPrice: 1000.00,
            guests: 2,
            guestName: user.name,
            guestEmail: user.email,
            guestPhone: user.phone
        });

        console.log("Creation SUCCESSFUL ID:", booking.id);

        // Now try with some optional fields missing
        const booking2 = await Booking.create({
            resortId: resort.id,
            userId: user.id,
            checkIn: '2024-12-01',
            checkOut: '2024-12-05',
            totalPrice: 500.0,
            guests: 1
        });

        console.log("Creation 2 SUCCESSFUL ID:", booking2.id);

        process.exit(0);
    } catch (err) {
        console.error("FAILED with error:", err);
        process.exit(1);
    }
}

test();
