const MongoClient=require('mongodb').MongoClient;
const url=`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-tu26g.mongodb.net/test`;
const url2="mongodb://localhost:27017"
const dbname='productsData';
var _db;

console.log(process.env.MONGO_USER);


const mongoConnect=(cb)=>{
MongoClient.connect(url).then(result=>{
    console.log("Connected to client successfulle");
    _db=result.db(dbname);
   console.log(process.env.MONGO_USER);

    
    cb();
}).catch(err=>{
    console.log(err);
    
})
}

const getDb=()=>{
    if(_db){
        return _db;
    }
    else{
        console.log("Not connected");
        
    }
}
exports.mongoConnect=mongoConnect;
exports.getDb=getDb;