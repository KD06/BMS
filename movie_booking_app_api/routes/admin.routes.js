const express = require('express')
const controller = require('../controllers/theater.controller')
const movieController = require('../controllers/movie.controller')
const { restrictToRole } = require('../middlewares/auth.middleware')

const router = express.Router()
router.use(restrictToRole('admin'))

// Theatre
router.get('/theatres', controller.getAllTheatres)
router.get('/theatres/:id', controller.getTheatreById)
router.post('/theatres', controller.createTheatre)
router.patch('/theatres/:id')
router.delete('/theatres/:id')

// Theatre Halls
router.get('/theatres/:theatreId/halls')
router.post('/theatres/:theatreId/halls')

// Movies
router.get('/movies', movieController.getAllMovies)
router.get('/movies/:id', movieController.getMovieById)
router.post('/movies', movieController.createMovie)
router.patch('/movies/:id')
router.delete('/movies/:id')

module.exports = router
