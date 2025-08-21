function sessionValidator(req,res,next){
    const openPath  = ['/','/signup.css','/clientAuth.js', "/Auth/action","/Auth/action/register","/Auth/action/login"]
    if(openPath.includes(req.path)) return next()
    if(req.session && req.session.user && req.session.user.id){
        next()
    }else{
        return res.status(401).send({message: "Unauthorized access."})
    }
}

module.exports = sessionValidator