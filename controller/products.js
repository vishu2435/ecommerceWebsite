const productModel=require('../Models/product')
const ObjectId=require('mongodb').ObjectID;
const formidable=require('formidable');
const cartModel=require('../Models/cart');
const dataB=require('../database');
const multer=require('multer');
const GridFsStorage=require('multer-gridfs-storage');

const {validationResult}=require('express-validator');


// const storage=new GridFsStorage({
//     url:"mongodb://localhost:27017",
//     db:dataB.getDb(),
//     file:(req,file)=>{
//         return new Promise((resolve,reject)=>{
//             console.log('Original file name',file.originalname);
//             console.log('File Object ',file);
            
//             const fileInfo={
//                 filename:file.originalname,
//                 bucket:'uploads'              
//             }
//             resolve(fileInfo);
//         })
//         }
// })





exports.addproducts=(req,res,next)=>{
   
    console.log(req.url);
    res.render('./admin/addproducts.ejs',{path:'/add-products',
    errorMessage:null,
     oldinput:{pName:'',price:'',saleprice:'',taxcategory:'',sku:'',category:''
     ,productDescription:''},
     validationParam:'',     
     user:req.user
    
    });
    
  
};
exports.adminProduct=(req,res,next)=>{
    productModel.Product.getAllProductById(ObjectId(req.user._id)).then(function(doc){
        //console.log("PRomise documents =========>  "+doc);
       // const loggedIn=req.get('Cookie').split(';')[2].trim().split('=')[1]==='true';
       if(!doc){
          return res.render('./admin/adminproducts',{document:doc,path:'/admin-products',
            errorMessage:'User Not Found'
            })
       }
       if(!doc[0]){
        return res.render('./admin/adminproducts',{document:doc,path:'/admin-products',
        errorMessage:'No Products Found'
        })
       } 
       res.render('./admin/adminproducts',{document:doc,path:'/admin-products',
        errorMessage:null});
    }).catch(err=>{
       // console.log('error =================================> ',err);
        
        var error=new Error('Some internal error occured')
        next(error);
    })
      
     };
exports.product=(req,res,next)=>{
    console.log(req.body);
    var error=validationResult(req)
    console.log('Error in add product',error.errors);
  //  console.log('Request ',req);
    
    console.log('image File ',req.file);
    if(!req.file){
        return res.status(422).render('./admin/addproducts.ejs',{
            path:'/add-products',
            errorMessage:'Invalid image type',
            oldinput:{pName:req.body.pName,price:req.body.price,saleprice:req.body.saleprice,
                taxcategory:req.body.taxcategory
                ,sku:req.body.sku,category:req.body.category,productDescription:req.body.productDescription},
            validationParam:''
            })
    }
    if(!error.isEmpty()){
       return res.status(422).render('./admin/addproducts.ejs',{
            path:'/add-products',
            errorMessage:error.errors[0].msg,
            oldinput:{pName:req.body.pName,price:req.body.price,saleprice:req.body.saleprice,
                taxcategory:req.body.taxcategory
                ,sku:req.body.sku,category:req.body.category,productDescription:req.body.productDescription},
            validationParam:error.errors[0].param
            })
    }
    else{
        var p=new productModel.Product(req.body.pName,req.body.price,
            req.body.saleprice,req.body.taxcategory,'/image/'+req.file.filename
            ,req.body.sku,req.body.category,req.body.productDescription,req.user._id);
            console.log(p.pName);
            
            p.save().then(function(t){
            //console.log(t);
                console.log("Add Product ",t);
                
                res.redirect('/add-products')
            
            
            
        }).catch(function(err){
            console.log(err);
            
        })
    }
    
    
}
exports.editProduct=(req,res,next)=>{
    console.log("parameter id",req.params.pid);
   var documentFound=false;
   const id=req.params.pid;
    
    productModel.Product.findProduct(ObjectId(id)).then(function(value){
        if(value){
           // console.log('Value is is is ios oisns ',value);
           
            res.render('./admin/editproduct.ejs',{doc:value,
                path:'/edit-products',
                errorMessage:null,
                validationParam:'',
                user:req.user
            });
        }
        else{
            res.render('404.ejs')
        }
       
        
    },function(err){
        console.log(err);
        
    })  


}

exports.updateProduct=(req,res,next)=>{
    //console.log("Body  ========================================================>",req.body);
    var error=validationResult(req)
    console.log('Error in edit product',error.errors);
    var filen=null;
    console.log('Edit products filename',req.file);
    
    if(req.file){
        filen='/image/'+req.file.filename;

    }else{
        filen=req.body.imgUrl;
    }
    console.log('Edit products filename',filen);
 
    if(!error.isEmpty()){
       return res.status(422).render('./admin/editproduct.ejs',{
            path:'',
            errorMessage:error.errors[0].msg,
            doc:req.body,
            validationParam:error.errors[0].param
            })
    }
    req.body._id=ObjectId(req.body._id);
    productModel.Product.update(req.body._id,req.body.pName,req.body.price,req.body.saleprice,req.body.taxcategory,
        filen,req.body.sku,req.body.category,req.body.productDescription,req.user._id)
        .then(function(r) {
            console.log(r);
            res.redirect('/admin-products');
        }).catch(function(err) {
            console.log(err);
            
        })
    
}
exports.deleteProduct=(req,res,nest)=>{
    console.log('id=<<<<<<<<<<<<<<<<',req.body.prodId);
    console.log(req.params.userId);
    
    if(req.session.user._id.toString()===req.params.userId.toString()){
       
        
        productModel.Product.deleteProduct(ObjectId(req.body.prodId)).then((result)=>{
            // console.log("Succesful ",result);
           res.status(200).json({message:'Success'});
        }).catch((err)=>{
            console.log("Unsuccessfull   ",err);
         res.status(500).json({message:'faliure'})
        })
    }else{
        res.send('<h1>Invalid user </h1>')
    }
    



    
}
    