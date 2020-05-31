const dataB=require('../database')
const productModel=require('./product');
const ObjectId=require('mongodb').ObjectID;
exports.order=class Order{
    constructor(id,order,totalprice,totalItems,userid,date){
        if(id){
            this._id=id;
        }
        this.order=order;
        this.totalprice=totalprice;
        this.totalItems=totalItems;
        this.userid=userid;
        this.Date=date
    }
    save(){
        const database=dataB.getDb();
        return database.collection('orders').insertOne(this);
    }
    loadOrder(orderItems){
        const database=dataB.getDb();
        const productIds=orderItems.map(o=>{
            return ObjectId( o.product_id);
        });
        return database.collection('products').find({"_id":{"$in":productIds}})
        .toArray()
        .then(result=>{
            result.forEach(r=>{
                this.order.productsordered.push({
                    ...r,
                    qty:orderItems.find(o=>{
                        return o.product_id.toString()===r._id.toString();
                    }).qty
                })
            })
        })
        
    }
    static findOrders(userid){
        const database=dataB.getDb();
        return database.collection('orders').find({userid:userid}).toArray();
    }

}

