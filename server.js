const https=require('https');

const express=require('express');
const bodyParser=require('body-parser');
const app=express();
const path=require('path');
const adminRoute=require('./routes/admin.js')
const shopRoute=require('./routes/shop.js')
const database=require('./database')
const ejs=require('ejs');
const csrf=require('csurf');
const User=require('./Models/user');
const morgan=require('morgan');
const ObjectId=require('mongodb').ObjectID;
const loginroute=require('./routes/login');
const session=require('express-session');
app.set('view engine','ejs')
// const MongoDBStore=require('connect-mongodb-session')(session);
// const MONGODB_URI=`mongodb://localhost:27017`
const flash=require('connect-flash');
const GridFsStorage=require('multer-gridfs-storage');
const dataB=require('./database');
const multer=require('multer');
const feedsRoute=require('./Rest Routes/feed');
const productModel=require('./Models/product');
const fs=require('fs');
const helmet=require('helmet');
const compression=require('compression');
const isAuth=require('./Middleware/is-auth')

const jwt=require('jsonwebtoken');
// const stores=new MongoDBStore({
//     uri:MONGODB_URI,
//     databaseName:'productsData',
//     collection:'sessions'
// })
// stores.on('error',err=>{
//     console.log(err);
    
// })

const fileStorge=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'image');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname);
    }

})
const fileFilter=(req,file,cb)=>{
    //cb(null,true);
    if(file.mimetype.toString()==='image/png'||file.mimetype.toString()==='image/jpg'||file.mimetype.toString()==='image/jpeg'){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

app.use(helmet());
app.use(compression());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

var accessLogSystem=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})
app.use(morgan('combined',{stream:accessLogSystem}));
app.use(express.static(path.join(__dirname,'public')))

app.use(multer({storage:fileStorge,fileFilter:fileFilter}).single('imageFile'))
app.use("/uploads",express.static(path.join(__dirname,'uploads')));
app.use('/image',express.static(path.join(__dirname,'image')));
const csrfProtection=csrf();
//app.use(session({secret:'My Secret',resave:false,saveUninitialized:true,store:stores}));
app.use('/feed',feedsRoute);

//const key=fs.readFileSync(path.join(__dirname,'server.key'));
//const certificate=fs.readFileSync(path.join(__dirname,'server.cert'));
//app.use(csrfProtection);
app.use(flash());
// app.use((req,res,next)=>{
    
// })


// app.use((req,res,next)=>{
    
    
    
//     // User.user.findUserById(req.session.user._id)
//     // .then(user=>{
//     //     //console.log(user);
//     // if(!user){
//     //     return next();
//     // }
//     //  req.user=new User.user(req.session.user._id,user.userName,user.userEmail,user.userPassword,user.cart,user.order,user.isAdmin);
//     //     next();
//     // })
//     // .catch(err=>{
//     //     console.log(err);
//     // })
// })
// app.use((req,res,next)=>{
//     res.locals.isLoggedin=req.session.isLoggedin;
//     //res.locals.crfToken=req.csrfToken()
//     if(req.session.isLoggedin){
//         if(req.user){
//             res.locals.isAdmin=req.user.isAdmin;
//             res.locals.user=req.user;
//         }
//         else{
//             res.locals.isAdmin=false;
//             res.locals.user=false;
//         }
        
//     }
//     else{
//         res.locals.isAdmin=false;
//         res.locals.user=false;
//     }

//     next()
// })
app.get('/checkauth',(req,res,next)=>{
    const token=req.headers.authorization.split(' ')[1]
   
    jwt.verify(token,"HJHDJHHJAHJHJJHDAJHDAJH",function(err,decoded){
        if(err){
           return res.status(200).json({
                loggedIn:false,
                error:err
            })
        }
        if(decoded){
            User.user.findUserByEmail(decoded.userEmail)
            .then(result=>{
                console.log("Logging from checkAuth server.js ",result)
                return res.status(200).json({
                    loggedIn:true,
                    error:false,
                    user:result
                })
            })        
            
        }
    })
})
app.get('/',(req,res,next)=>{
   // const loggedIn=req.get('Cookie').split(';')[2].trim().split('=')[1]==='true';    
//console.log("Session from homepage ",req.session.user.getCartProducts);
console.log(req.headers.authorization)
if(req.headers.authorization){
    const token=req.headers.authorization.split(' ')[1]
    console.log(token)
    jwt.verify(token,"HJHDJHHJAHJHJJHDAJHDAJH",function(err,decoded){
        if(err){
            productModel.Product.getAllProduct()
            .then(function(doc){
                
                
           //     var imgUrl=path.join(__dirname,doc.imgUrl.toString())
            //  const loggedIn=req.get('Cookie').split(';')[2].trim().split('=')[1]==='true';
                res.status(200).json({
                    ...doc,
                    error:err
                });
            })
              
        }
        if(decoded){
          console.log("From server .js ",decoded);
             
        User.user.findUserByEmail(decoded.userEmail)
        .then(user=>{
            //console.log(user);
        // req.user=new User.user(user._id,user.userName,user.userEmail,user.userPassword,user.cart,user.order,user.isAdmin);
        productModel.Product.getAllProduct()
        .then(function(doc){
        
            return res.status(200).json({
                loggedIn:true,
                user:user,
                ...doc
            })
        })
           
        })
        .catch(err=>{
            console.log(err);
        })
            
        }
          
    
    })

}else{
    productModel.Product.getAllProduct()
            .then(function(doc){
                
                
           //     var imgUrl=path.join(__dirname,doc.imgUrl.toString())
            //  const loggedIn=req.get('Cookie').split(';')[2].trim().split('=')[1]==='true';
                res.status(200).json({
                    ...doc,
                   
                });
            })
}

    
   

  });

  app.use(loginroute);
app.use(adminRoute);
app.use(shopRoute);
app.get('/getjson',(req,res,next)=>{
    var myobj={
        name:'Vishesh',
        age:18,
        lastName:'goyal'
    }
    res.send(myobj);
})
// app.use((req,res)=>{
    
    
//     res.render('404.ejs');
// })

app.use((error,req,res,next)=>{
    console.log("Erorr logging from server.js ",error);
    
    // res.render('../views/500.ejs',{
    //     error:error
    // })
})
database.mongoConnect(()=>{
 app.listen(process.env.PORT||1080);
    
})
