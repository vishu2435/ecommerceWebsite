const exp=require('express');
const route=exp.Router();
const feedController=require('../Rest Controller/feeds');


route.get('/posts',feedController.getFeeds);
route.post('/post',feedController.postFeed);
module.exports=route;