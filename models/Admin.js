let mongoose = require('mongoose')

let adminSchema = mongoose.Schema({
    name: String,
    mobileNumber: String,
    otp: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('Admin', adminSchema)