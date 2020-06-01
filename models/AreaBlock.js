let mongoose = require('mongoose')

let areaBlockSchema = mongoose.Schema({
    name: String
})

module.exports = mongoose.model('AreaBlock', areaBlockSchema)