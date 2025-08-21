const express = require('express')
const sessionValidator = require('../middlewares/sessionValidator')
const router = express.Router()


const redirectLinkJournal = "/Journal/OnlineJournal.html" 
const redirectLinkTaskList = "/tasklist/task-list.html"

router.post("/protected", sessionValidator, (req,res) => {

})


router.post("/protected/tasklist", sessionValidator, (req,res) => {
     res.status(200).send({link: redirectLinkTaskList})
})

router.post("/protected/journal", sessionValidator, (req,res) => {
    res.status(200).send({link: redirectLinkJournal})
})

module.exports = router