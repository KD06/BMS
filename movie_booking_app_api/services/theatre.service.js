const Theatre = require('../models/theatre.model')
const TheatreHall = require('../models/theatre-halls.model')
const TheatreHallMovieMapping = require('../models/theatre-hall-movie-mapping')
const {
    createTheatreValidationSchema,
    createTheatreHallSchema,
} = require('../lib/validators/theater.validator')

class TheatreService {
    /**
     * @function getAll
     * @returns { Promise<Theatre[]> } List of theatres
     */
    static async getAll() {
        const theatres = await Theatre.find({})
        return theatres
    }

    static getHallsByTheatreId(id) {
        return TheatreHall.find({ theatreId: id })
    }

    static async createTheatreHall(data) {
        const validationResult = await createTheatreHallSchema.parseAsync(data)
        return TheatreHall.create(validationResult)
    }

    static async create(data) {
        const safeParsedData =
            await createTheatreValidationSchema.safeParseAsync(data)
        if (safeParsedData.error) throw new Error(safeParsedData.error)
        return await Theatre.create(safeParsedData.data)
    }

    static getById(id) {
        return Theatre.findById(id)
    }

    static createShow(data) {
        return TheatreHallMovieMapping.create(data)
    }

    static getShowsByMovieId(movieId) {
        return TheatreHallMovieMapping.find({ movieId }).populate({
            path: 'theatreHallId',
            populate: [{ path: 'theatreId' }],
        })
    }

    static getShowsByMovieIdExtended(movieId) {
        return TheatreHallMovieMapping.find({ movieId }).populate({
            path: 'theatreHallId',
            populate: [{ path: 'theatreId' }],
        })
    }
}

module.exports = TheatreService
