let mongoose = require('mongoose')

let familySchema = mongoose.Schema({
    headName: String,
    headMobileNumber: String,
    headGovtIdType: {
        type: String,
        default: ''
    },
    headGovtIdNumber: {
        type: String,
        default: ''
    },
    address: String,
    block: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AreaBlock'
    },
    containmentArea: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContainmentArea'
    },
    zoneType: String,
    dateOfSurvey: {
        type: Date
    },
    numberOfMembers: Number,
    surveyOfficer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SurveyOfficer'
    }
})

module.exports = mongoose.model('Family', familySchema)