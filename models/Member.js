let mongoose = require('mongoose')

let memberSchema = mongoose.Schema({
    name: String,
    age: Number,
    sex: String,
    mobileNumber: String,
    govtIdType: {
        type: String,
        default: ''
    },
    govtIdNumber: {
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
    surveyOfficer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SurveyOfficer'
    },
    symptoms: [String],
    deseases: [String],
    pregnancy: {
        type: Boolean,
        default: false
    },
    traveledFrom: {
        type: String,
        default: null
    },
    travelDate: {
        type: Date,
        default: null
    },
    sourceContacted: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContainmentSource',
        default: null
    },
    contactNature: {
        type: String,
        default: null
    },
    contactRelation: {
        type: String,
        default: null
    },
    riskLevel:  {
        type: String,
        default: 'none'
    },
    selectedForSample:  {
        type: Boolean,
        default: false
    },
    quarantined: {
        type: Boolean,
        default: false
    },
    quarantineDate: {
        type: Date,
        default: null
    },
    homeQuarantined: {
        type: Boolean,
        default: false
    },
    quarantineCenter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuarantineCenter'
    },
    releaseDate: {
        type: Date,
        default: null
    },
    headName: String,
    headMobileNumber: String,
    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family'
    },
    surveyDate: Date
})

module.exports = mongoose.model('Member', memberSchema)