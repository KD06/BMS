const Booking = require('../models/booking.model')

class BookingService {
    static getAll() {
        return Booking.find({})
    }

    static getByShowId(showId) {
        return Booking.find({ showId: showId })
    }
}

module.exports = BookingService
