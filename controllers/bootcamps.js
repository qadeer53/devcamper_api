const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middlewares/async')
const Bootcamps = require('../models/Bootcamps')

exports.getBootcamps = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults)
})

exports.getBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamps.findById(req.params.id)

        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp not found of id ${req.params.id}`, 404))
        }

        res.status(200).json({
            success: true,
            data: bootcamp
        })
})

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const publishedBootcamp = await Bootcamps.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

  const bootcamp = await Bootcamps.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp
  });
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
        let bootcamp = await Bootcamps.findById(req.params.id)

        if (!bootcamp) {
            return res.status(400).json({ success: false })
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
         return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} is unauthorized to update bootcamp`,
        400
      )
    );
    }
    
    bootcamp = await Bootcamps.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            success: true,
            data: bootcamp
        })
})

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamps.findById(req.params.id)
       
        if (!bootcamp) {
            return res.status(400).json({ success: false })
    }
    
     if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
         return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} is unauthorized to delete bootcamp`,
        400
      )
    );
    }

        bootcamp.remove()
    
        res.status(200).json({
            success: true,
            data: {}
        })
})