let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let cors = require('cors')
let mongoose = require('mongoose')

mongoose.connect(`${process.env.MONGODB_URL}`)

let db = mongoose.connection

db.once("open", function() {
    console.log("Connected to mongo db successfully");
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

app.use(express.static('build'))

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/build/index.html')
})

app.get('/survey', (req, res) => {
    res.sendFile(__dirname+'/build/index.html')
})

let adminRouter = require('./router/admin')
let dataRouter = require('./router/data')
let surveyRouter = require('./router/survey')

app.use("/api/admin", adminRouter)
app.use("/api/data", dataRouter)
app.use("/api/survey", surveyRouter)

app.listen(process.env.port, () => {
    console.log(`server running on port ${process.env.port}`)
})