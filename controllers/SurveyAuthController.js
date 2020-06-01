let SurveyOfficer = require('../models/SurveyOfficer')
let jwt = require('jsonwebtoken')
let MessageService = require('../Services/MessageService')
let Family = require('../models/Family')
let Member = require('../models/Member')

let SurveyAuthController = {

    login(req, res) {
        SurveyOfficer.findOne(req.body).exec((err, officer) => {
            if(err) res.status(400).send(err)
            else if(officer) {
                let otp = Math.floor(1000 + Math.random() * 9000)
                officer.otp = otp
                officer.save((err, officer) => {
                    if(err) res.status(400).send(err)
                    else {
                        MessageService.sendOtp(officer.mobileNumber, otp)
                        res.status(200).send("verify otp")
                    }
                })
                
            } else res.status(201).send("Officer does not exist")
        })
    },


    confirmOtp(req, res) {
        SurveyOfficer.findOne(req.body).exec((err, officer) => {
            if(err) res.status(400).send(err)
            else if(officer) {
                let token = jwt.sign({officerId: officer._id, mobileNumber: officer.mobileNumber, 
                   name: officer.name }, process.env.JWT_KEY)

                res.status(200).json({officer: {...officer._doc, token: token}})
            } else res.status(201).send("Invalid OTP")
        })
    },


    validateToken(req, res) {
        if(req.isAuth) {
            SurveyOfficer.findById(req.officerId).exec((err, officer) => {
                if(err) res.status(400).send(err)
                else res.status(200).json({officer: {...officer._doc, token: req.token}})
            })
        } else res.status(201).send("Not valid token")
    },


    saveFamily(req, res) {
        let newF = new Family(req.body.family)
        newF.save((err, family) => {
            if(err) res.status(400).send(err)
            else res.status(200).json({family})
        })
    },


    saveMember(req, res) {
        let mem = new Member(req.body.member)
        mem.save((err, member) => {
            if(err) res.status(400).send(err)
            else res.status(200).json({member})
        })
    }
}

module.exports = SurveyAuthController