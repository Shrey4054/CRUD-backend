const express = require('express')
const router = express.Router()

router.get("/test-secure", (req, res) => {
    console.log("req.secure:", req.secure);
    res.send(`req.secure is ${req.secure}`);
});


module.exports = router;