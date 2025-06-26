const express = require('express')
const movieController = require('../controllers/movie.controller')
const theatreController = require('../controllers/theater.controller')

const router = express.Router()

router.get('/movies', movieController.getAllMovies)
router.get('/shows/:movieId', theatreController.listShowsByMovieId) // Todo: Make this public route

module.exports = router
