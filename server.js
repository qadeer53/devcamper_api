const express = require('express');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const auth = require('./routes/auth');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middlewares/error')
const connectDB = require('./config/db')

dotenv.config({ path: 'config/config.env' })

// Database connection

connectDB();

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())

app.use(morgan('dev'))

app.use(mongoSanitize());

app.use(helmet());

app.use(xss());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

app.use(hpp());

app.use(cors());

app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

app.use(errorHandler)

const Server = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.bold.yellow));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err}`)
    Server.close(() => process.exit(1));
})