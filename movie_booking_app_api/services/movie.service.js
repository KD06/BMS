const Movie = require('../models/movies.model')
const {
  createMovieValidationSchema,
} = require('../lib/validators/movie.validators')

class MovieService {
  static getAll() {
    return Movie.find({})
  }

  static getById(id) {
    return Movie.findById(id)
  }

  static async createMovie(data) {
    const safeParsedData = await createMovieValidationSchema.parseAsync(data)
    return await Movie.create(safeParsedData)
  }
}

module.exports = MovieService
