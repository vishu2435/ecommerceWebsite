const dataB=require('../database');
const ObjectId=require('mongodb').ObjectID;
exports.user= class User{
    
    constructor(_id,userName,userEmail,userPassword,cart,order,isAdmin,shippingDetails){
        if(_id){
            this._id=ObjectId(_id);
        }
        this.userName=userName;
        this.userEmail=userEmail;
        this.userPassword=userPassword;
        this.cart=cart;
        this.order=order;
        this.resetToken=null;
        this.resetTokenExpiration=null;
        this.isAdmin=isAdmin;
        this.shippingDetails=shippingDetails;
    }

    save(){
        const database=dataB.getDb();
        return database.collection('users').insertOne(this);
    }
    update(){
        const database=dataB.getDb();
        return database.collection('users').updateOne({_id:this._id},{$set:this});
    }
    changeQty(productid,quantity){
        const productIndex=this.cart.items.findIndex(p=>{
            //console.log("Items   ................. ",p,typeof p.product_id,typeof product._id);
           return p.product_id.toString()===productid.toString();
        });
        if(quantity===0){
            this.cart.items.splice(productIndex,1);
        }else{
            this.cart.items[productIndex].qty=quantity
        }
        var updateCart=[...this.cart.items];
        var items={items:updateCart}
        const database=dataB.getDb();
        return database.collection('users').updateOne({_id:this._id},{$set:{cart:items}}) 

    }
    addToCart(product){
        if("items" in this.cart){
            const productIndex=this.cart.items.findIndex(p=>{
                //console.log("Items   ................. ",p,typeof p.product_id,typeof product._id);
               return p.product_id.toString()===product._id.toString();
            });
            var updateCart=[...this.cart.items];
           // console.log("Update cart .... ",updateCart);
            
            var newQuantity=1
            if(productIndex>=0){
                newQuantity=this.cart.items[productIndex].qty+1
                this.cart.items[productIndex].qty=newQuantity;
            }else{
                updateCart.push({product_id:product._id,qty:newQuantity});
            }
            const updatedCart={items:updateCart};
            const database=dataB.getDb();
           // console.log('updated cart items',this.cart.items);
            
            console.log("Index is ",productIndex);
            
            return database.collection('users').updateOne({_id:this._id},{$set:{cart:updatedCart}})    
        }else{
            const updatedCart={items:[{product_id:product._id,qty:1}]};
            console.log('updated cart items',updatedCart);
            
            const database=dataB.getDb();
            return database.collection('users').updateOne({_id:this._id},{$set:{cart:updatedCart}}) ; 
        }
        
    }
    getCartProducts(){
        console.log("In get Cart Products ...........",this.cart.items);
        
        var ids=this.cart.items.map(p=>{
            return p.product_id;
        });
        var newProdObject={}
        const database=dataB.getDb();
        return database.collection('products').find({_id:{$in:ids}})
        .toArray()
        .then(result=>{
         newProdObject= result.map(p=>{
                return {
                    ...p,
                    
                    qty:this.cart.items.find(i=>{
                       return i.product_id.toString()===p._id.toString();
                    }).qty
                    
                }
            })
            return newProdObject;    
            
        })
        .catch(function(err){
            console.log(err);
            
        })
    }


    deleteCartProducts(id){
        const database=dataB.getDb();
        var updateCart=[...this.cart.items];
        var pIndex=updateCart.findIndex(u=>{
            return u.product_id.toString()===id.toString()
        })
       // console.log("Cart before updation///////////////////////////",updateCart);
        updateCart.splice(pIndex,1);
        //console.log("Cart after updation///////////////////////////",updateCart);
        var updatedCart={
            items:updateCart
        }
        return database.collection('users').updateOne({_id:this._id},{$set:{cart:updatedCart}});
    }

    static findUserByEmail(emailID){
        const database=dataB.getDb();
        console.log("Logging from [user Model user.js] ",emailID );
        
        return database.collection('users').find({userEmail:emailID})
                .next()
                .then(result=>(result))
                .catch(err=>{console.log(err);
                })
    }
    static findUserById(id){
        const database=dataB.getDb();
        return database.collection('users').find({_id:id})
        .next()
        .then(function(result){
        return result
        })
        .catch(function(err){
            console.log(err);
            
        });
    }
}