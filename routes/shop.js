const exp=require('express');
const route=exp.Router();
const paths=require('path');
const fs=require('fs');
const isAuth=require('../Middleware/is-auth');
const shop=require('../controller/shop')
//const routes=require('../route.js');

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
route.get('/latestproducts/:pid',shop.productDetails);
route.get('/latestproducts',shop.shopProduct);
route.get('/cart',isAuth.forLoggedin,shop.cartGet);
route.post('/cart/del',isAuth.forLoggedin,shop.cartDeletePost);
route.post('/cart',isAuth.forLoggedin,shop.cartPost);
route.post('/order',shop.postOrders);
route.post('/changeQty',shop.changeQty)
route.get('/orders',isAuth.forLoggedin,shop.getOrders);
route.get('/invoice',isAuth.forLoggedin,shop.getInvoice);
route.get('/checkout',isAuth.forLoggedin,shop.getCheckOut);
module.exports=route;