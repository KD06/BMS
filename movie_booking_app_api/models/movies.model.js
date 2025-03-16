const { Schema, model } = require('mongoose')

const moviesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    language: {
      type: String,
    },
    imageURL: {
      type: String,
    },
    durationInMinutes: {
      type: Number,
    },
  },
  { timestamps: true }
)

const Movie = model('movie', moviesSchema)

module.exports = Movie
