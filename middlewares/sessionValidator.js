function sessionValidator(req,res,next){
    console.log(`Before if else: ${res.user}`) //undefined why
    const openPath  = ['/','/signup.css','/clientAuth.js', "/Auth/action","/Auth/action/register","/Auth/action/login"]
    if(openPath.includes(req.path)) return next()
    if(req.session.user && req.session.user.id){
        next()
    }else{
        console.log(`inside the else:${req.session.user}`) //undefined why
        return res.status(401).send({message: "Unauthorized access."})
    }
}

module.exports = sessionValidator