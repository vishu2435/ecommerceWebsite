
deleteProduct=(btn)=>{
    const prodID=btn.parentNode.querySelector('[name=_id]').value;
    const csrfToken=btn.parentNode.querySelector('[name=_csrf]').value;
    const userId=btn.parentNode.querySelector('[name=userId]').value;
    const product=btn.closest('.productCard')
    data={
        prodId:prodID
    }
    fetch('/admin-products/delete/'+userId,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'csrf-token':csrfToken
        },
        body:JSON.stringify(data)
    
        
    }).then(result=>{
       return result.json() 
    })
    .then(data=>{
        console.log('hi',data);
        console.log(product);
        product.remove();
        
    })
    .catch(err=>{
        console.log(err);
        
    })
}
