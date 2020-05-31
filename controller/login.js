const dataB=require('../database');
const User=require('../Models/user');
const ObjectId=require('mongodb').ObjectID;
const bcrypt=require('bcryptjs');
const nodemailer=require('nodemailer');
const crypto=require('crypto');
const {validationResult}=require('express-validator');
const jwt=require('jsonwebtoken')

let transporter=nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:'visheshtaposthali@gmail.com',
        pass:'oxlyyzzmlivogqls'
    }
});
exports.login=(req,res,next)=>{
    
    res.render('./user/login.ejs',{path:'/login',
        errorMessage:null,
        oldinput:{userEmail:'',userPassword:''}
        })
}

function genereateWebToken(user){
    var u={
        userName:user.userName,
        userEmail:user.userEmail,
    }
    return token=jwt.sign(u,"HJHDJHHJAHJHJJHDAJHDAJH",{
        expiresIn:60*3
    })
}

exports.postLogin=(req,res,next)=>{
    var userEmail=req.body.userEmail;
    var userPassword=req.body.userPassword;
    var database=dataB.getDb();
    const erro=validationResult(req);
   // console.log('From Login',erro);
    
    //console.log('From Login',erro.errors);
    
    var message=null;
    
    
    if(!erro.isEmpty()){
        message=erro.errors[0].msg;
        return res.status(422).json({
            message:"Cannot login",
            error:message
        })
    }else{  
    database.collection('users').find({userEmail:userEmail})
    .next()
    .then(function(person){
        
        bcrypt.compare(userPassword,person.userPassword,function(err,doMatch){
            if(!err){
                if(doMatch){
                    genereateWebToken(person);
                    res.status(200).json({
                        user:person,
                        token:token,
                        expireOn:Date.now()+180000
                    })                                    
                }
                else{
                    return res.status(422).json({
                        error:"Invalid passwod"
                    })
                }
            }else{
                console.log('Error in logging in ',err);
                
            }
        })
    })
}
    
    
}
exports.postLogout=(req,res,next)=>{
    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/')
    })
}
exports.getSignUp=(req,res,next)=>{
    res.status(200).json({

    })
}

exports.postSignUp=(req,res,next)=>{
    const database=dataB.getDb();
    userEmail=req.body.userEmail;
    userName=req.body.userName;
    userPassword=req.body.userPassword;
    const erro=validationResult(req);
    console.log(erro);
    
    console.log(erro.errors);
    console.log(erro.errors);
    
    var message=null;
    
    
    if(!erro.isEmpty()){
        message=erro.errors[0].msg;
        return res.status(422).json({
            error:message,
            message:"Some error occured"

        })
    }
    
    database.collection('users').find({userEmail:userEmail})
    .next()
    .then(function(person){
        const cart={items:[]};
        const order=[];
        bcrypt.hash(userPassword,12,function(err,hash){
            const user=new User.user(null,userName,userEmail,hash,cart,order,false);
            user.save().then(function(result){
                transporter.sendMail({
                    to:userEmail,
                    from:'visheshtaposthali@gmail.com',
                    subject:'Hello '+userName,
                    html:'<p>Hey '+userName+' glad you joined us shop with us </p>'
                }).then(function(res){
                    console.log("Email sent " , res);
                
                }).catch(err=>{
                    console.log(err);
                    
                })
                res.status(200).json({
                    user:user,
                    status:"usercreated",
                    result:result

                })
            })
            return true;
        })
        
    })
     .catch(err=>{
        console.log(err);
        
    })
 
}


exports.getReset=(req,res,next)=>{
    res.render('./user/reset.ejs',{
        path:'/',
        errorMessage:req.flash('error'),
        setNewPassword:false
    });
}
exports.postReset=(req,res,next)=>{
    const database=dataB.getDb();
    crypto.randomBytes(32,(err,buf)=>{
        if(err){
            console.log(err);
            req.flash('error','cannot Generate Token')
            return res.redirect('/reset');
    
        }
        const token=buf.toString('hex');
        database.collection('users').find({userEmail:req.body.userEmail})
    .next()
    .then(person=>{
        if(!person){
           req.flash('error','wrong password');
            return res.redirect('/reset');
        }
        const user=new User.user(person._id,person.userName,person.userEmail,person.userPassword,person.cart);
        user.resetToken=token;
        user.resetTokenExpiration=Date.now()+3600000;
        user.update()
        .then(result=>{
            res.redirect('/')
            transporter.sendMail({
            
                to:req.body.userEmail,
                from:'visheshtaposthali@gmail.com',
                subject:'Hello ',
                html:
                '<p>You requested reset password </p>'+
                '<p>Click this <a href="http://localhost:1080/reset/${token}">link</a> to reset password' 
                
            }).then(function(res){
                console.log("Email sent " , res);
            
            }).catch(err=>{
                console.log(err);
                
            })           
        })
    })
    .catch()
    })
    
}

exports.resetPassword=(req,res,next)=>{
    console.log(req.params.pid);
    const database=dataB.getDb();
    database.collection('users').find({resetToken:req.params.pid})
    .next()
    .then(person=>{
        console.log("Person",person);
        
        if(!person){
            req.flash('error','wrong password');
             return res.send('<h1>Not Valid Token</h1>');
         }
         res.render('./user/changepassword.ejs',{
            path:'/',
            token:req.params.pid
         })
         
        })
}
exports.postResetPassword=(req,res,next)=>{
    const database=dataB.getDb();
    database.collection('users').find({resetToken:req.body.token})
    .next()
    .then(person=>{
        console.log("Person",person);
        
        if(!person){
            req.flash('error','wrong password');
             return res.send('<h1>Not Valid Token</h1>');
         }
         bcrypt.hash(req.body.userPassword,12)
         .then(password=>{

            const user=new User.user(person._id,person.userName,person.userEmail,password,person.cart);
            
         user.update()
         .then(result=>{
             console.log('result');
             
            return res.redirect('/login')
         }).catch(err=>{
             console.log(err);
             
         })
         }).catch(err=>{
             console.log(err);
             
         })
         
    })
}

