const Room = require('../models/Room');
const Customer = require('../models/Customer');
const Reservation = require('../models/Reservation');
const Bill = require('../models/Bill');
exports.overview = async (req, res) => {
  const [totalRooms, availableRooms, occupiedRooms, totalCustomers, totalReservations, activeReservations, revenue] = await Promise.all([
    Room.countDocuments(), Room.countDocuments({ status: 'Available' }), Room.countDocuments({ status: 'Occupied' }),
    Customer.countDocuments(), Reservation.countDocuments(), Reservation.countDocuments({ status: { $in: ['Pending','Confirmed','CheckedIn'] } }),
    Bill.aggregate([{ $group: { _id: null, total: { $sum: '$paidAmount' } } }])
  ]);
  res.json({ success: true, data: { totalRooms, availableRooms, occupiedRooms, totalCustomers, totalReservations, activeReservations, totalRevenue: revenue[0]?.total || 0 } });
};
