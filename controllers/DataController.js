let Admin = require('../models/Admin')
let jwt = require('jsonwebtoken')
let MessageService = require('../Services/MessageService')
let SurveyOfficer = require('../models/SurveyOfficer')
let AreaBlock = require('../models/AreaBlock')
let ContainmentArea = require('../models/ContainmentArea')
let QuarantineCenters = require('../models/QuarantineCenter')
let ContainmentSource = require('../models/ContainmentSource')

let DataController = {

    getAreaBlocks(req, res) {
        AreaBlock.find().exec((err, blocks) => {
            if(err) res.status(400).send(err)
            else res.status(200).json({blocks})
        })
    },


    getContainmentAreas(req, res) {
        ContainmentArea.find().exec((err, containment_areas) => {
            if(err) res.status(400).send(err)
            else res.status(200).json({containment_areas})
        })
    },

    getQuarantineCenters(req, res) {
        QuarantineCenters.find().exec((err, quarantine_centers) => {
            if(err) res.status(400).send(err)
            else res.status(200).json({quarantine_centers})
        })
    },

    getContainmentSources(req, res) {
        ContainmentSource.find().exec((err, containment_sources) => {
            if(err) res.status(400).send(err)
            else res.status(200).json({containment_sources})
        })
    },

    getContainmentAreaSources(req, res) {
        ContainmentArea.findById(req.body.areaId).exec((err, area) => {
            if(err) res.status(400).send(err)
            else {
                ContainmentSource.find({_id: {$in: area.containmentSources}}).exec((err, sources) => {
                    if(err) res.status(400).send(err)
                    else res.status(200).json({sources})
                })
            }
        })
    }

}

module.exports = DataController