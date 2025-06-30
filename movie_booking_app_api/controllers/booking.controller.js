const {
    bookingCreationValidationSchema,
    verifyPaymentValidationSchema,
} = require('../lib/validators/booking.validator')
const Razorpay = require('razorpay')
const Show = require('../models/theatre-hall-movie-mapping')
const Hall = require('../models/theatre-halls.model')
const Booking = require('../models/booking.model')
const { hash } = require('../utils/hash')
const BookingService = require('../services/booking.service')

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
})

async function handleCreateBooking(req, res) {
    const validationResult =
        await bookingCreationValidationSchema.safeParseAsync(req.body)

    if (validationResult.error)
        return res.status(400).json({ error: validationResult.error })

    const { seatNumber, showId } = validationResult.data

    const show = await Show.findById(showId)

    if (!show) return res.status(400).json({ error: 'Invalid Show' })

    const hall = await Hall.findById(show.theatreHallId)

    if (!hall) return res.status(400).json({ error: 'Invalid Hall' })

    // ### uncomment after testing
    //   if (show.startTimestamp <= Date.now()) {
    //     return res.status(400).json({ error: 'Show already started' })
    //   }

    if (seatNumber > hall.seatingCapacity)
        return res.status(400).json({ error: 'Invalid Seat Number' })

    const alreadyBooked = await Booking.findOne({ showId, seatNumber })

    if (alreadyBooked)
        return res.status(400).json({ error: 'Seat is already booked' })
    let order
    try {
        order = await razorpay.orders.create({
            amount: show.price * 100,
            currency: 'INR',
            notes: {
                seatNumber,
                showId,
            },
            receipt: `receipt_${Date.now()}`,
        })
    } catch (err) {
        console.error(err)
        res.status(500).send('Something went wrong')
    }

    return res.json({ order: order })
}

async function verifyPayment(req, res) {
    const validationResult = await verifyPaymentValidationSchema.safeParseAsync(
        req.body
    )

    if (validationResult.error)
        return res.status(400).json({ error: validationResult.error })

    const { paymentId, orderId, signature } = validationResult.data

    const RAZORPAY_API_SECRET = process.env.RAZORPAY_API_SECRET

    const serverSignature = hash(
        `${orderId}|${paymentId}`,
        RAZORPAY_API_SECRET,
        'SHA256'
    )

    if (serverSignature !== signature)
        return res.status(400).json({ error: `Payment signature match failed` })

    const paymentInfo = await razorpay.payments.fetch(paymentId)
    const { status, notes } = paymentInfo

    // if (status !== 'captured')
    //     return res.status(400).json({ error: `Payment is not captured` })

    const { seatNumber, showId } = notes

    try {
        await Booking.create({
            gateway: 'RAZORPAY',
            paymentId,
            showId,
            seatNumber,
            userId: req.user._id,
        })

        return res.status(201).json({ status: 'success' })
    } catch (err) {
        // await razorpay.payments.refund(paymentId, {amount, speed: 'normal'})
        return res.status(500).json({ status: 'Failure' })
    }
}

async function getBookedSeatIds(req, res) {
    const id = req.params.id
    const seats = await BookingService.getByShowId(id)

    return res.json({ status: 'success', data: seats || [] })
}
module.exports = { handleCreateBooking, verifyPayment, getBookedSeatIds }
