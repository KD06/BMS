const { Schema, model } = require('mongoose')

const theatreHallsSchema = new Schema(
  {
    number: {
      type: Number,
      required: true,
      min: 0,
    },
    seatingCapacity: {
      type: Number,
      required: true,
      min: 0,
    },
    theatreId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'theatre',
    },
  },
  { timestamps: true }
)

theatreHallsSchema.index({ number: 1, theatreId: 1 }, { unique: true })

const TheatreHall = model('theatreHall', theatreHallsSchema)

module.exports = TheatreHall
