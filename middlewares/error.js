const ErrorResponse = require('../utils/ErrorResponse');
const errorHandler = (err, req, res, next) => {
    let error = { ...err }

    error.message = err.message

    console.log(err)

    if (err.name === 'CastError') {
        const message = `Bootcamp not found of id ${err.id}`
        error = new ErrorResponse(message, 404)
    }

    if (err.name === 11000) {
        const message = 'Duplicate value entered'
        error = new ErrorResponse(message, 400)
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val=>val.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error'
    })
}

module.exports = errorHandler