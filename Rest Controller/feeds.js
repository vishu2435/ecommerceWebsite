exports.getFeeds=(req,res,next)=>{
    res.status(200).json({posts:[{
        title:'FirstPost',
        content:'this is first post'
    }]})
}

exports.postFeed=(req,res,next)=>{
   var title=req.body.title
    var content=req.body.content
    console.log('From rest routes logging ',req.body);
    
    res.json({
        message:'Success',
        post:{
            _id:Date.now(),
            title:title,
            content:content
            }
    })
}