const MongoClient=require('mongodb').MongoClient;

const assert=require('assert');
const url='mongodb+srv://vishesh:ajay1970@cluster0-tu26g.mongodb.net/test?retryWrites=true&w=majority';
const dbname='productsData';

const dataB=require('../database');       



exports.Product=class Product{
    constructor(pName,price,saleprice,taxcategory,imgUrl,sku,category,productDescription,userId){
        
        this.pName=pName;
        this.price=price;
        this.saleprice=saleprice;
        this.taxcategory=taxcategory;
        this.imgUrl=imgUrl;
        this.sku=sku;
        this.category=category;
        
        this.productDescription=productDescription;
        this.userId=userId
       
    }
    save(){
        const database=dataB.getDb();

        return database.collection('products').insertOne(this);
        // new Promise ((resolve,reject) =>{
        //     const database=dataB.getDb();
        //         database.collection('products').insertOne(this,function(err,r){
        //             assert.equal(null,err);
                    
        //             console.log('Total',r.insertedCount,' ',r.result);
        //             assert.equal(1,r.insertedCount);
                    
        //             resolve (true)
        //         });
                
            
        // })
    };
    
    static getAllProduct(){
        const database=dataB.getDb();
//        console.log("Database==========================>",database);   
        
        return database.collection('products').find({}).toArray()
            // .then(function(result){
            //   return result
            // })
            // .catch(function(err){
            //    console.log('Finding error ========>',err);
            
            // })
                  
            
        
    };
    static getAllProductById(userId){
        const database=dataB.getDb();
       // console.log("Database==========================>",database);   
        
        return database.collection('products').find({userId:userId}).toArray()
            .then(function(result){
              return result
            })
            .catch(function(err){
               console.log(err);
            
            })
                  
            
        
    };
    static update(_id,pName,price,saleprice,taxcategory,imgUrl,sku,category,productDescription,userId){
        
        
        return new Promise((resolve,reject)=>{
            const database=dataB.getDb();
            

            database.collection('products').updateOne({_id:_id},{$set:{pName:pName,price:price,
            saleprice:saleprice,taxcategory:taxcategory,imgUrl:imgUrl,sku:sku,category:category,
            productDescription:productDescription,userId:userId}})
            .then(function(r){
                console.log(r);
                resolve(r)
            }).catch(function(err){
                console.log(err);
                
                reject(err)
            })

            
        })
    }
    static deleteProduct(pId){
        return new Promise((resolve,reject)=>{
            const database=dataB.getDb();
            database.collection('products').deleteOne({_id:pId}).then((result)=>{
                resolve(result);
            }).catch((err)=>{
                reject(err)
            })
        })
    }
    static findProduct(id){
        const database=dataB.getDb();
        return database.collection('products').find({_id:id})
        .next()
        .then(function(result){
            return result
        })
        .catch(function(err){
            return err;
        })
            
        
    }
    
}