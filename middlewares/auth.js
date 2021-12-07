const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
         return next(new ErrorResponse('Unauthorized',401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decoded.id)
        
        next()
    } catch (err) {
        return next(new ErrorResponse('Unauthorized',401));
    }
})

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
              return next(new ErrorResponse(`${req.user.role} is Unauthorized to access this`,401));
        }
        next()
    }
}