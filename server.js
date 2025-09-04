require('dotenv').config()
const express = require('express')
const cors = require('cors')

const session = require('express-session')
const sessionValidator = require("./middlewares/sessionValidator")
const journalRoutes = require('./routes/journalAPI')
const AuthRoutes = require('./routes/Auth')
const taskListRoutes = require('./routes/taskListApi')
const redirectRoutes = require('./middlewares/redirects')

const app = express()
const PORT = process.env.PORT || 3000
const SECRET = process.env.SECRET || "dfhjsjakdfhsaot4uhfjdao;u4tsjai"

app.use(cors(
    {
        credentials: true
    }
))
app.use(express.json())
app.use(session(
    {
        secret: SECRET,
        saveUninitialized: false,
        resave: false,
        cookie : {
            maxAge: 60 * 800 * 600,
            secure: true,
            sameSite: "none"
        }
    }
))







app.use(sessionValidator)
app.use('/Auth', AuthRoutes)

app.use('/journal', journalRoutes)
app.use('/taskList', taskListRoutes)
app.use('/redirect',redirectRoutes)



app.listen(PORT, () => {
    console.log(`Listing on port : ${PORT}`)
})




