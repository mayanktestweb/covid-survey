let mongoose = require('mongoose')

let quarantineCenterSchema = mongoose.Schema({
    name: String,
    address: String,
    capacity: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('QuarantineCenter', quarantineCenterSchema)