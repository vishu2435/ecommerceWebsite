

var firebaseConfig = {
    apiKey: "AIzaSyB9BeQIKkSsMuxHLvSxBab2wK0YsyAwfL0",
    authDomain: "shopapp-b4227.firebaseapp.com",
    databaseURL: "https://shopapp-b4227.firebaseio.com",
    projectId: "shopapp-b4227",
    storageBucket: "shopapp-b4227.appspot.com",
    messagingSenderId: "743361156488",
    appId: "1:743361156488:web:177f301af029d8e10e563d",
    measurementId: "G-QXLX93FM3G"
  };

  firebase.initializeApp(firebaseConfig);
console.log(firebase);

 
function uploadForm(formData){

}
var file;
$(document).ready(function(){
    
    
    $('#contactForm').on('submit',function(e){
        
            
            console.log(e);
            var $form=e.currentTarget;
            var productName=$('#contactForm').find('#productName');
            var skuCode=$('#contactForm').find('#skuCode'),
                price=$('#contactForm').find('#price'),
                saleprice=$('#contactForm').find('#salePrice'),
                imgUrl=$('#contactForm').find('#imageUrl'),
                
                category=$('#contactForm').find('#category');
                
                
                
          
          
            console.log(productName.val());
            //console.log(productName.val());
            
            if(productName.val()===''){
                console.log('Has Error productname');
                productName.closest('.form-group').addClass('has-error')
                e.preventDefault();
            }
            else if(skuCode.val()===''){
                skuCode.closest('.form-group').addClass('has-error')
                
                console.log('Has Error');
                 e.preventDefault();
            }
            else if(price.val()===''){
                price.closest('.form-group').addClass('has-error')
                
                console.log('Has Error');
                 e.preventDefault();
            }
            else if(saleprice.val()===''){
                saleprice.closest('.form-group').addClass('has-error')
                
                console.log('Has Error');
                 e.preventDefault();
            } else if(imgUrl.val()===''){
                imgUrl.closest('.form-group').addClass('has-error')
                
                console.log('Has Error');
                 e.preventDefault();
            } else if(category.val()===''){
                category.closest('.form-group').addClass('has-error')
                
                console.log('Has Error');
                 e.preventDefault();
            }
            else{
                $('#contactForm form').find('.form-group').addClass('has-success').removeClass('has-error');
                $('#contactForm form').find('button[type=submit]').after('<span>  Message sent </span>')
            }
        
      
        // console.log(form);
        
        
    })
})