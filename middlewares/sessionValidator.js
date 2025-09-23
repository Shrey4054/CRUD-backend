function sessionValidator(req,res,next){
    console.log(`Before if else: ${req.session}`) //undefined why
    const openPath  = ['/','/signup.css','/clientAuth.js', "/Auth/action","/Auth/action/register","/Auth/action/login"]
    if(openPath.includes(req.path)) return next()
    if(req.session.user){
        next()
    }else{
        console.log(`inside the else:${req.session.user}`) //undefined why
        return res.status(401).send({message: "Unauthorized access."})
    }
}

module.exports = sessionValidator

//req.session.user in Auth.js is not transferred over or stored in req.session here, 
// could be a not storing into the session storage.
// if it is being saved it's not getting to here