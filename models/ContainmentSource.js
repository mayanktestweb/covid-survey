let mongoose = require('mongoose')

let containmentSourceSchema = mongoose.Schema({
    name: String,
    mobileNumber: String,
    age: Number,
    address: String,
    block: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AreaBlock'
    },
    blockName: String,
    adhar: String,
    familyHead: String,
    traveledFrom: String,
    arrivalDate: Date,
    quarantineDate: Date,
    releaseDate: Date,
    quarantineCenter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuarantineCenter'
    },
    quarantineCenterName: String
})

module.exports = mongoose.model('ContainmentSource', containmentSourceSchema)