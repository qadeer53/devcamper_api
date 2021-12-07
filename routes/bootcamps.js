const express = require('express');
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp
} = require('../controllers/bootcamps')

const Bootcamps = require('../models/Bootcamps')

const advancedResults = require('../middlewares/advancedResults')

const courseRouter = require('./courses')
const reviewRouter = require('./reviews')

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth')

router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewRouter)

router
    .route('/')
    .get(advancedResults(Bootcamps, 'courses'), getBootcamps)
    .post(protect, authorize('publisher','admin'), createBootcamp)

router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher','admin'), updateBootcamp)
    .delete(protect, authorize('publisher','admin'), deleteBootcamp)

module.exports = router