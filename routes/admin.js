

const {body}=require('express-validator');
const exp=require('express');
const route=exp.Router();
const productModel=require('../Models/product');
const paths=require('path');
const fs=require('fs');
const fileType=require('file-type');
const formidable=require('formidable');
const readChunk=require('read-chunk');
const isAuth= require('../Middleware/is-auth');
const productController=require('../controller/products');

route.get('/add-products',isAuth.forAdmin,productController.addproducts);
route.get('/admin-products/:pid',isAuth.forAdmin,productController.editProduct);
route.get('/admin-products',isAuth.forAdmin,productController.adminProduct);
route.post('/admin-products/delete/:userId',isAuth.forAdmin,productController.deleteProduct);
route.post('/edit-product',

[               body('pName')
                    .trim(),
                body('price')
                    .trim(),
                body('saleprice')
                    .trim(),
                
                body('productDescription')    
                    .trim()

],isAuth.forAdmin,productController.updateProduct);
route.post('/product',
[               body('pName')
                 
                    .isLength({min:3})
                    .withMessage('Title Too Short')
                    .trim(),
                body('price')
                    .trim(),
                body('saleprice')
                    .trim(),
                body('productDescription')    
                    .trim()

],isAuth.forAdmin,productController.product);


// route.post('/product-image',(req,res,next)=>{
//     console.log('in post');
//     var form=new formidable.IncomingForm();
//     var photos=[];
//     form.multiples=true;
//     //form.uploadDir=paths.join(__dirname,'..','uploads');
//     console.log('changed');
    
//     form.maxFileSize=80007296780;
//     form.on('file',function(name,file){
//         var buffer=null,
//             type=null,
//             filename='';
//             console.log("fILE OBJECT  ===>  ",file," PATHE ====> ",file.path);
            
//             buffer=readChunk.sync(file.path,0,550);
//             type= fileType.fromBuffer(buffer);
//                 console.log("ext ===> ",file.name.split('.')[file.name.split('.').length-1]);
//                 if(file.name.split('.')[1]==='jpg'||file.name.split('.')[1]==="png"||file.name.split('.')[1]==="jpeg"||file.name.split('.')[1]==="mkv"||file.name.split('.')[1]==="mp4"){
//                     filename=Date.now()+'-'+file.name;
//                     fs.renameSync(file.path,paths.join(__dirname,'..','uploads/'+filename));
//                     photos.push({
//                         status:true,
//                         filename:filename,
//                         type:type.ext,
//                         publicPath:'uploads/'+filename
//                     });
//                     console.log("Pushed");
                    
//                 }else{
//                     photos.push({
//                         status:false,
//                         filename:filename,
//                         message:'Invalid file type'
//                     });
//                     fs.unlink(file.path,(err)=>{
//                         console.log(err);
                        
//                     });
//                     console.log("Pushed");
//                 }     
                
            
           
            
//     });

//     form.on('error', function(err) {
//         console.log('Error occurred during processing - ' + err);
//     });

//     // Invoked when all the fields have been processed.
//     form.on('end', function() {
//         console.log('All the request fields have been processed.');
        
//     });

//     // Parse the incoming form fields.
//     form.parse(req, function (err, fields, files) {
//         res.status(200).json(photos);
//         console.log("Fields ========>  ",fields," files ========> ",files);
        
//     });
    
// })
module.exports=route;