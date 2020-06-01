let express = require('express')
let router = express.Router()
let AdminController = require('../controllers/AdminController')
let ReportController = require('../controllers/ReportController')

let adminAuth = require('../middlewares/adminAuth')

router.use(adminAuth)

router.post('/validate_token', (req, res) => {
    AdminController.validateToken(req, res)
})

router.post("/login", (req, res) => {
    AdminController.login(req, res)
})

router.post("/confirm_otp", (req, res) => {
    AdminController.confirmOtp(req, res)
})

router.get("/survey_officers", (req, res) => {
    if(!req.isAuth) res.status(400).send("not authorized")
    else {
        AdminController.getSurveyOfficers(req, res)
    }
})

router.post("/add_survey_officer", (req, res) => {
    if(!req.isAuth) res.status(400).send("not authorized")
    else {
        AdminController.addSurveyOfficer(req, res)
    }
})

router.post("/delete_survey_officer", (req, res) => {
    if(!req.isAuth) res.status(400).send("not authorized")
    else {
        AdminController.deleteSurveyOfficer(req, res)
    }
})

router.post("/add_block", (req, res) => {
    if(!req.isAuth) res.status(400).send("not authorized")
    else {
        AdminController.addBlock(req, res)
    }
})

router.post("/delete_block", (req, res) => {
    if(!req.isAuth) res.status(400).send("not authorized")
    else {
        AdminController.deleteBlock(req, res)
    }
})

router.post("/add_containment_area", (req, res) => {
    if(!req.isAuth) res.status(400).send("not authorized")
    else {
        AdminController.addContainmentArea(req, res)
    }
})

router.post("/edit_containment_area", (req, res) => {
    if(!req.isAuth) res.status(400).send("not authorized")
    else {
        AdminController.editContainmentArea(req, res)
    }
})

router.post("/delete_containment_area", (req, res) => {
    if(!req.isAuth) res.status(400).send("not authorized")
    else {
        AdminController.deleteContainmentArea(req, res)
    }
})

router.post("/add_quarantine_center", (req, res) => {
    if(!req.isAuth) res.status(400).send("not authorized")
    else {
        AdminController.addQuarantineCenter(req, res)
    }
})

router.post("/add_containment_source", (req, res) => {
    if(!req.isAuth) res.status(400).send("not authorized")
    else {
        AdminController.addContainmentSource(req, res)
    }
})


router.post("/attach_containment_sources", (req, res) => {
    if(!req.isAuth) res.status(400).send("not authorized")
    else {
        AdminController.attachContainmentSources(req, res)
    }
})

router.post("/fetch_general_report", (req, res) => {
    if(!req.isAuth) res.status(400).send("not authorized")
    else {
        ReportController.getGeneralReport(req, res)
    }
})

router.post('/save_edited_member', (req, res) => {
    if(!req.isAuth) res.status(400).send("not authorized")
    else {
        ReportController.saveEditedMember(req, res)
    }
})

module.exports = router;