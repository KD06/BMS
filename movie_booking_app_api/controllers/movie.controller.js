const MovieService = require('../services/movie.service')
const {
    createMovieValidationSchema,
} = require('../lib/validators/movie.validator')

async function getAllMovies(req, res) {
    const movies = await MovieService.getAll()
    return res.json({ data: movies })
}

async function getMovieById(req, res) {
    const id = req.params.id
    const movie = await MovieService.getById(id)

    if (!movie) return res.status(404).json({ error: 'Movie not found' })

    return res.json({ status: 'success', data: movie })
}

async function createMovie(req, res) {
    const validationResult = await createMovieValidationSchema.safeParseAsync(
        req.body
    )

    if (validationResult.error)
        return res.status(400).json({ error: validationResult.error })

    const { title, description, durationInMinutes, imageURL, language } =
        validationResult.data

    const movie = await MovieService.createMovie({
        title,
        description,
        durationInMinutes,
        imageURL,
        language,
    })

    return res.status(201).json({ status: 'success', data: movie })
}
module.exports = { getAllMovies, createMovie, getMovieById }
