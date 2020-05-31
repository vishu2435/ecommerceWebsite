const jwt=require('jsonwebtoken');

exports.forLoggedin=(req,res,next)=>{
    if(req.headers.authorization.split(' ')[1]){
        jwt.verify(req.headers.authorization.split(' ')[1],"HJHDJHHJAHJHJJHDAJHDAJH",function(err,decoded){
            if(err){
                return res.status(200).json({
                    error:err,
                    message:"Please Login again",
                    token:req.headers.authorization.split(' ')[1]
                })
            }
            if(decoded){
                next();
            }
        })
    }else{
        return res.status(200).json({err :"No Authorization headers"})
    }    

}
exports.forLoggedOut=(req,res,next)=>{
    console.log(req.session.isLoggedin);
    
    if(req.session.isLoggedin){
        req.session.destroy(err=>{
            console.log(err);
             res.redirect('/login')
        })
       
    }
    else{
        next()
    }
    

}

exports.forAdmin=(req,res,next)=>{
    if(req.session.isLoggedin&&req.user.isAdmin){
        next();
    }
    else{
        return res.send('<h1>You are not admin Please Login as one After logging out</h1>')
    }
}