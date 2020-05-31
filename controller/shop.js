const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId=require('mongodb').ObjectID;
const path=require('path');
const jwt=require('jsonwebtoken')
// Connection URL
const url = 'mongodb+srv://vishesh:ajay1970@cluster0-tu26g.mongodb.net/test?retryWrites=true&w=majority';
const fs=require('fs');
// Database Name
const dbName = 'productsData';

// Create a new MongoClient
const client = new MongoClient(url);
const productModel=require('../Models/product')
const cartModel=require('../Models/cart');
const User=require('../Models/user')
const orderModel=require('../Models/orders');
const dataB=require('../database');

exports.shopProduct=(req,res,next)=>{
  productModel.Product.getAllProduct()
  .then(function(doc){
  //  const loggedIn=req.get('Cookie').split(';')[2].trim().split('=')[1]==='true';
      res.render('./user/latestproducts.ejs',{document:doc,path:'/latestproducts'});
  })
    
   }
   exports.productDetails=(req,res,next)=>{
  //  console.log(req.params.pid);
   var documentFound=false;
   const id=req.params.pid;
    
    productModel.Product.findProduct(ObjectId(id)).
    then(function(value){
       // const loggedIn=req.get('Cookie').split(';')[2].trim().split('=')[1]==='true';    
    //     res.render('./user/productDetails.ejs',{product:value,
    //     isLoggedin:req.session.isLoggedin,
    // path:''});


        res.status(200).json({
            product:value
        })
                
    })
    .catch(function(err){
        console.log(err);
       next(err); 
    })  

}

exports.cartGet=(req,res,next)=>{
    const token=req.headers.authorization.split(' ')[1]
    jwt.verify(token,"HJHDJHHJAHJHJJHDAJHDAJH",function(err,decoded){
       if(err){
        return res.status(200).json({
            error:err,
            message:"Please Login again",
            token:req.headers.authorization.split(' ')[1]
        })
        }
        if(decoded){
            User.user.findUserByEmail(decoded.userEmail)
            .then(userFound=>{
              
              const userObject=new User.user(userFound._id,
                                  userFound.userName,userFound.userEmail,
                                  userFound.userPassword,userFound.cart,userFound.order,
                                  userFound.isAdmin);  
                userObject.getCartProducts()
                .then(response=>{
                    var totalPrice=0;
                for(let i=0; i<response.length;i++){
                    console.log("In getCart products ",response[i]);
                    totalPrice+=response[i].saleprice*response[i].qty
                    
                }
                    return res.status(200).json({
                        products:response,
                        totalPrice:totalPrice
                    })
                })
                .catch(err=>{
                    console.log("Logging error from get Cart product  ",err)
                    return res.status(500).json({message:"cannot get products"})
                })

            
            })
         }
    
    
    })
    
        
    }

exports.changeQty=(req,res,next)=>{
    const token=req.headers.authorization.split(' ')[1] 
    jwt.verify(token,"HJHDJHHJAHJHJJHDAJHDAJH",function(err,decoded){
        if(err){
         return res.status(200).json({
             error:err,
             message:"Please Login again",
             token:req.headers.authorization.split(' ')[1]
         })
        
        }
        if(decoded){
            User.user.findUserByEmail(decoded.userEmail)
            .then(userFound=>{
              
              const userObject=new User.user(userFound._id,
                                  userFound.userName,userFound.userEmail,
                                  userFound.userPassword,userFound.cart,userFound.order,
                                  userFound.isAdmin,userFound.shippingDetails);

                userObject.changeQty(req.body.id,req.body.qty)
                .then(response=>{
                userObject.getCartProducts()
                    .then(response=>{
                      var totalPrice=0;
                         for(let i=0; i<response.length;i++){
                          console.log("In getCart products ",response[i]);
                     totalPrice+=response[i].saleprice*response[i].qty
                    
                         }
                         return res.status(200).json({
                            result:response,
                            message:"Cart updated",
                            totalPrice:totalPrice    
                        })
                })
                .catch(err=>{
                    console.log("Logging error from get Cart product  ",err)
                    return res.status(500).json({message:"cannot get products"})
                })

                   
                })
                .catch(err=>{
                    console.log("Logging error from add product to cart ",err)
                    return res.status(500).json({message:"cannot add product"})
                })
            })
        }
    
    })
}


exports.cartPost=(req,res,next)=>{
   console.log(req.body.id);
   
   const token=req.headers.authorization.split(' ')[1]
    jwt.verify(token,"HJHDJHHJAHJHJJHDAJHDAJH",function(err,decoded){
       if(err){
        return res.status(200).json({
            error:err,
            message:"Please Login again",
            token:req.headers.authorization.split(' ')[1]
        })
        }
         if(decoded){
          User.user.findUserByEmail(decoded.userEmail)
          .then(userFound=>{
            
            const userObject=new User.user(userFound._id,
                                userFound.userName,userFound.userEmail,
                                userFound.userPassword,userFound.cart,userFound.order,
                                userFound.isAdmin);
        productModel.Product.findProduct(ObjectId(req.body.id))
            .then(function(result){
        fs.writeFile('logs.txt',result,function(err){
            console.log(err);
            userObject.addToCart(result)
            .then(response=>{
                
                return res.status(200).json({
                    result:response,
                    message:"Added to cart",
                    
                })
            })
            .catch(err=>{
                console.log("Logging error from add product to cart ",err)
                return res.status(500).json({message:"cannot add product"})
            })
        })
        
        
    })
    .catch(function(err){
        console.log("Logging error from add product to cart",err);
        
    })
     
          })
          
          
          
    }
        
    })

   
   
   
}
exports.cartDeletePost=(req,res,next)=>{
console.log(req.body._id);
  req.user.deleteCartProducts(req.body._id)
  .then(function(r) {
      res.redirect('/cart')
  })
}


exports.postOrders=(req,res,next)=>{
    const token=req.headers.authorization.split(' ')[1]
    jwt.verify(token,"HJHDJHHJAHJHJJHDAJHDAJH",function(err,decoded){
        if(err){
         return res.status(200).json({
             error:err,
             message:"Please Login again",
             token:req.headers.authorization.split(' ')[1]
         })
        }
        if(decoded){
    User.user.findUserByEmail(req.user._id)
    .then(result=>{
        const userObject=new User.user(result._id,
            result.userName,result.userEmail,
            result.userPassword,result.cart,result.order,
            result.isAdmin,result.shippingDetails);
        if(result.cart.items.length!==0){
            var orders={productsordered:[]};
            const database=dataB.getDb();
            var newOrder=new orderModel.order(null,orders,0,0,userObject._id,new Date());
            newOrder.loadOrder(result.cart.items)
            .then(result=>{
                
                
                
                newOrder.order.productsordered.forEach(p=>{
                         newOrder.totalprice+=parseInt(p.saleprice)*parseInt(p.qty);
                         newOrder.totalItems+=parseInt(p.qty);
                })
                console.log('new order ======================>',newOrder);
                newOrder.save();  
                userObject.cart.items=[];
                userObject.order.push({
                    order_id:newOrder._id,
                    orderDate:newOrder.Date
                })
                userObject.update();
                res.status(200).json({
                    order:userObject.order,
                    isSuccessful:true
                });
            })
        }
       
        
    })
    }
        })
}

exports.getOrders=(req,res,next)=>{
    if(!req.user){
        return res.redirect('/login');
    }
    else{
        orderModel.order.findOrders(ObjectId(req.user._id))
        .then(result=>{
            res.render('./user/order.ejs',{
                path:'/orders',
                order:result
            })
        })
    }
}
exports.getInvoice=(req,res,next)=>{

    fs.readFile(path.join(__dirname,'..','data','invoice.pdf'),function(err,data){
        if(!err){
            res.setHeader('Content-Type','application/pdf');
            res.setHeader('Content-Disposition','attachment; filename="vishu.pdf"');
            res.send(data)
        }
        
    })
}

exports.getCheckOut=(req,res,next)=>{
    if(!req.user){
        return res.redirect('/login');
    }

    req.user.getCartProducts().then(function(r){
        var totalprice=0;
        var totalqty=0;
        r.forEach(p=>{
           // console.log('Loggind From Checkout get route items are',p);
            
            totalprice+=parseInt(p.saleprice)*p.qty;
            totalqty+=parseInt(p.qty);
        })
        res.render('./user/checkout',{path:'/cart',
             totalprice:totalprice   ,
             totalitems:totalqty
        }); 
    })
}