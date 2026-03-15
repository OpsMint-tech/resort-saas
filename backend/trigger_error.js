const { Booking, Resort } = require('./models');
async function test() {
   const resort = await Resort.findOne();
   console.log("Found resort:", resort.id);
   const b = await Booking.create({
      resortId: resort.id,
      checkIn: "2026-03-20",
      checkOut: "2026-03-25",
      totalPrice: 100
   });
   console.log("Created booking, JSON representation:", b.toJSON());
}
test().catch(console.error).finally(() => process.exit(0));
