const fs = require('fs');
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

dotenv.config({ path: './config/config' })

const Bootcamp = require('./models/bootcamps')

mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
})
    
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))

const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)

        console.log('Data Imported'.blue)
        process.exit(1)
    } catch (err) {
        console.error(err)
    }
}

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()

        console.log('Data Destroyed'.red)
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

if (process.argv[2] === '-1') {
    importData()
} else if (process.argv[2] === '-d') {
    deleteData()
}