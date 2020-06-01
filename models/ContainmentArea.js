let mongoose = require('mongoose')

let containmentAreaSchema = mongoose.Schema({
    name: String,
    block: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AreaBlock'
    },
    blockName: String,
    containmentStatus: {
        type: Boolean,
        default: true
    },
    containmentSources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContainmentSource'
    }]
})

module.exports = mongoose.model('ContainmentArea', containmentAreaSchema)