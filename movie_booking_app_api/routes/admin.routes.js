const express = require('express')
const theatreController = require('../controllers/theater.controller')
const movieController = require('../controllers/movie.controller')
const { restrictToRole } = require('../middlewares/auth.middleware')

const router = express.Router()

router.use(restrictToRole('admin'))

// Theatre
router.get('/theatres', theatreController.getAllTheatres)
router.get('/theatres/:id', theatreController.getTheatreById)
router.post('/theatres', theatreController.createTheatre)
router.patch('/theatres/:id')
router.delete('/theatres/:id')

// Theatre Halls
router.get(
    '/theatres/:theatreId/halls',
    theatreController.getTheatreHallsByTheatreId
)
router.post('/theatres/halls', theatreController.createTheatreHall)

// Theatre Halls Movie Mapping
router.post('/shows', theatreController.createShow)

// Movie
router.get('/movies/:id', movieController.getMovieById)
router.post('/movies', movieController.createMovie)
router.patch('/movies/:id')
router.delete('/movies/:id')

module.exports = router
