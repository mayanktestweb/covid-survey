let Admin = require('../models/Admin')
let jwt = require('jsonwebtoken')
let MessageService = require('../Services/MessageService')
let SurveyOfficer = require('../models/SurveyOfficer')
let AreaBlock = require('../models/AreaBlock')
let ContainmentArea = require('../models/ContainmentArea')
let QuarantineCenter = require('../models/QuarantineCenter')
let ContainmentSource = require('../models/ContainmentSource')

let AdminController = {

    validateToken(req, res) {
        if (req.isAuth) {
            Admin.findById(req.adminId).exec((err, admin) => {
                if(err) res.status(400).send(err)
                else res.status(200).json({status: 'valid', admin})
            })
        } else {
            res.status(200).json({status: 'invalid'})
        }
    },

    login(req, res) {
        Admin.findOne(req.body).exec((err, admin) => {
            if(err) res.status(400).send(err)
            else {
                if(admin) {
                
                    let otp = Math.floor(1000 + Math.random()*9000)
                    admin.otp = otp;

                    admin.save((err, admn) => {
                        if(err) res.status(400).send(err)
                        else {
                            MessageService.sendOtp(req.body.mobileNumber, otp)
                            res.status(200).send("otp sent")
                        }
                    })

                } else res.status(201).send("admin does not exist")
            }
        })
    },

    confirmOtp(req, res) {
        Admin.findOne(req.body).exec((err, admin) => {
            if(err) res.status(400).send(err)
            else {
                if(admin) {
                    let token = jwt.sign({adminId: admin._id, mobileNumber: admin.mobileNumber, 
                        name: admin.name}, process.env.JWT_KEY)
    
                    res.status(200).json({admin: admin, token: token})
                } else res.status(201).send("Admin not found")
            }
        })
    },


    getSurveyOfficers(req, res) {
        SurveyOfficer.find().exec((err, surveyOfficers) => {
            if(err) res.status(400).send(err)
            else res.status(200).json({surveyOfficers})
        })
    },


    addSurveyOfficer(req, res) {
        let officer = new SurveyOfficer(req.body)
        officer.save((err, surveyOfficer) => {
            if(err) res.status(400).send(err)
            else res.status(200).json({surveyOfficer})
        })
    },


    deleteSurveyOfficer(req, res) {
        SurveyOfficer.findByIdAndDelete(req.body.officerId).exec((err, doc) => {
            if(err) res.status(400).send(err)
            else res.status(200).send('done')
        })
    },


    addBlock(req, res) {
        let areablock = new AreaBlock(req.body)
        areablock.save((err, block) => {
            if(err) res.status(400).send(err)
            else res.status(200).json({block})
        })
    },

    deleteBlock(req, res) {
        AreaBlock.findByIdAndDelete(req.body.blockId).exec((err, doc) => {
            if(err) res.status(400).send(err)
            else res.status(200).send("done")
        })
    },


    addContainmentArea(req, res) {
        let area = new ContainmentArea(req.body)
        area.save((err, containment_area) => {
            if(err) res.status(400).send(err)
            else res.status(200).json({containment_area})
        })
    },


    editContainmentArea(req, res) {
        ContainmentArea.findById(req.body.areaId).exec((err, carea) => {
            carea.name = req.body.name
            carea.block = req.body.block
            carea.blockName = req.body.blockName
            carea.containmentStatus = req.body.containmentStatus

            carea.save((err, area) => {
                if(err) res.status(400).send(err)
                else res.status(200).json({area})
            })
        })
    },


    deleteContainmentArea(req, res) {
        ContainmentArea.findByIdAndDelete(req.body.areaId).exec((err, doc) => {
            if(err) res.status(400).send(err)
            else res.status(200).send('done')
        })
    },

    addQuarantineCenter(req, res) {
        let center = new QuarantineCenter(req.body)
        center.save((err, quarantine_center) => {
            if(err) res.status(400).send(err)
            else res.status(200).json({quarantine_center})
        })
    },


    addContainmentSource(req, res) {
        let csource = new ContainmentSource(req.body)
        csource.save((err, source) => {
            if(err) res.status(400).send(err)
            else res.status(200).json({source})
        })
    },

    attachContainmentSources(req, res) {
        ContainmentArea.findById(req.body.areaId).exec((err, area) => {
            if(err) res.status(400).send(err)
            else {
                area.containmentSources = req.body.containmentSources;
                area.save((err, ar) => {
                    if(err) res.status(400).send(err)
                    else res.status(200).send("success")
                })
            }
        })
    }
}

module.exports = AdminController