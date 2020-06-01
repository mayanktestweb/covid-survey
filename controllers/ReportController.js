let Admin = require('../models/Admin')
let jwt = require('jsonwebtoken')
let MessageService = require('../Services/MessageService')
let SurveyOfficer = require('../models/SurveyOfficer')
let AreaBlock = require('../models/AreaBlock')
let ContainmentArea = require('../models/ContainmentArea')
let QuarantineCenters = require('../models/QuarantineCenter')
let ContainmentSource = require('../models/ContainmentSource')
let Member = require('../models/Member')

let ReportController = {

    getGeneralReport(req, res) {
        Member.find(req.body.query).exec((err, general_report) => {
            if(err) res.status(400).send(err)
            else res.status(200).json({general_report})
        })
    },


    saveEditedMember(req, res) {
        Member.updateOne({_id: req.body.memberId}, {$set: req.body.updates}).exec((err, member) => {
            if(err) res.status(400).send(err)
            else res.status(200).json({member})
        })
    }

}

module.exports = ReportController