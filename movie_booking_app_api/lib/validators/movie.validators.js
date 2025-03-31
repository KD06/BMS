const { z } = require('zod')

const createMovieValidationSchema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(3).max(500).optional(),
  language: z.string().min(3).max(50).optional(),
  imageURL: z.string().url().optional(),
  durationInMinutes: z.number().optional(),
})

module.exports = {
  createMovieValidationSchema,
}
