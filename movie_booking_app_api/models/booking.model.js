const { Schema, model } = require('mongoose')

const bookingSchema = new Schema(
    {
        showId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'theatreHallMovieMapping',
        },
        seatNumber: {
            type: Number,
            required: true,
        },
        paymentId: {
            type: String,
            required: true,
        },
        gateway: {
            enum: ['STRIPE', 'RAZORPAY'],
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'user',
        },
    },
    { timestamps: true }
)

bookingSchema.index({ showId: 1, seatNumber: 1 }, { unique: true })
bookingSchema.index({ gateway: 1, paymentId: 1 }, { unique: true })

const Booking = model('booking', bookingSchema)

module.exports = Booking
