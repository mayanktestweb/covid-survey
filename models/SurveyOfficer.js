let mongoose = require('mongoose')

let surveyOfficerSchema = mongoose.Schema({
    name: String,
    mobileNumber: {
        type: String,
        unique: true
    },
    otp: {
        type: String,
        default: ''
    },
    age: Number,
    adhar: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('SurveyOfficer', surveyOfficerSchema)