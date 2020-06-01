let express = require('express')
let router = express.Router()
let DataController = require('../controllers/DataController')

router.get("/areablocks", (req, res) => {
    DataController.getAreaBlocks(req, res)
})

router.get("/containment_areas", (req, res) => {
    DataController.getContainmentAreas(req, res)
})

router.get("/quarantine_centers", (req, res) => {
    DataController.getQuarantineCenters(req, res)
})

router.get("/containment_sources", (req, res) => {
    DataController.getContainmentSources(req, res)
})

router.post("/containment_area_sources", (req, res) => {
    DataController.getContainmentAreaSources(req, res)
})

module.exports = router;