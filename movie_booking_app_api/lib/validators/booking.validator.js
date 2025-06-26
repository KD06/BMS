const { z } = require('zod')

const bookingCreationValidationSchema = z.object({
    showId: z.string(),
    seatNumber: z.number().min(1),
})

const verifyPaymentValidationSchema = z.object({
    paymentId: z.string(),
    orderId: z.string(),
    signature: z.string(),
})

module.exports = {
    bookingCreationValidationSchema,
    verifyPaymentValidationSchema,
}
