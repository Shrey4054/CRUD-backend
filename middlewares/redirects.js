const express = require('express')
const sessionValidator = require('../middlewares/sessionValidator')
const router = express.Router()


const redirectLinkJournal = "/Journal/OnlineJournal.html" 
const redirectLinkTaskList = "/tasklist/task-list.html"


router.get('/', (req,res) => {
    return res.status(200).send({"session": req.session.user})
})

router.get("/protected", (req,res) => {
    return res.status(200).send({session :req.session.user})
})


router.post("/protected/tasklist", sessionValidator, (req,res) => {
     console.log(`logging from redirect: ${req.session.user}`)
     res.status(200).send({link: redirectLinkTaskList})
})

router.post("/protected/journal", sessionValidator, (req,res) => {
    console.log(req.session.user)
    res.status(200).send({link: redirectLinkJournal})
})

module.exports = router