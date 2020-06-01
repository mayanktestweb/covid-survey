let express = require('express')
let router = express.Router()
let SurveyAuthController = require('../controllers/SurveyAuthController')
let surveyAuth = require('../middlewares/surveyAuth')

router.use(surveyAuth)

router.post("/login", (req, res) => {
    SurveyAuthController.login(req, res)
})

router.post("/confirm_otp", (req, res) => {
    SurveyAuthController.confirmOtp(req, res)
})

router.post('/validate_token', (req, res) => {
    SurveyAuthController.validateToken(req, res)
})

router.post("/save_family", (req, res) => {
    SurveyAuthController.saveFamily(req, res)
})

router.post("/save_member", (req, res) => {
    SurveyAuthController.saveMember(req, res)
})

module.exports = router;