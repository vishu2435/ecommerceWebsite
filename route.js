const fs=require('fs');
const paths=require('path');

var mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};
const requestHandler=(req,res)=>{
var path;
if(req.url==='/'){
    path=paths.join(__dirname,'html','p2.html');
    console.log(path);
}
else{
    path=paths.join(__dirname,'html',req.url);
    console.log(path);
}
console.log('url',req.url);

var contentType=mimeTypes['.'+path.split('.')[1]];
console.log('Extension type',path.split('.')[1]);


fs.readFile(path,function(err,content){
    if(err){
        console.log('Error',err);
        
        if(err=='ENOENT'){
            res.setHeader('Status Code',404);
            res.end('<h1> Cannot find File</h1>')    
        }  
        else{
            
res.writeHead(500,{
    'content-length':12,
    'Content-Type':contentType,
    'connection':'keep-alive'
})

            res.end('<h1> error</h1>') 
        }
    }
    else{
        
res.writeHead(200,{
    'content-length':12,
    'Content-Type':contentType,
    'connection':'keep-alive'
})
        console.log(content);
        res.end(content,'utf-8');
    }
    })
}

module.exports=requestHandler;