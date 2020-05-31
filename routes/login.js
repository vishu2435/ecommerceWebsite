const {check}=require('express-validator');
const {body}=require('express-validator');
const exp=require('express');
const route=exp.Router();
const loginController=require('../controller/login');
const isAuth=require('../Middleware/is-auth')
const dataB=require('../database');
route.get('/login',loginController.login)
route.post('/login',[check('userEmail').custom(value=>{
    const database=dataB.getDb();
    return database.collection('users').find({userEmail:value})
    .next()
    .then(function(person){
        console.log("peerson ",person);
        
        if(!person){
            console.log("User does not Exists");
            return Promise.reject('E-mail Invalid')       
        }
            
    
    })
})],loginController.postLogin);



route.post('/logout',loginController.postLogout);
route.get('/signup',loginController.getSignUp);

route.post('/signup',
[check('userPassword').isLength({min:5}).withMessage('Minimum password length be 5'),
check('userEmail').isEmail().custom(value=>{
    const database=dataB.getDb();
    return database.collection('users').find({userEmail:value})
    .next()
    .then(function(person){
        console.log("peerson ",person);
        
        if(person){
            console.log("User Exists");
            return Promise.reject('E-mail already in use')       
        }
        
    })
}),
check('confirmPassword').custom((value,{req})=>{
    if(value!==req.body.userPassword){
        throw new Error('Passwords have to match!');
    }
    return true;
})
],loginController.postSignUp);



route.get('/reset',isAuth.forLoggedOut,loginController.getReset);
route.post('/reset',isAuth.forLoggedOut,loginController.postReset);
route.get('/reset/:pid',isAuth.forLoggedOut,loginController.resetPassword);
route.post('/reset/:pid',isAuth.forLoggedOut,loginController.postResetPassword);
module.exports=route;