$('#upload-photos').on('submit',function(event){
    event.preventDefault();
    var files=$('#inputFile').get(0).files;
    console.log("Files array",files);
    var formData=new FormData();
    if(files.length===0){
        alert('no files added');
        return false;
    }
    if(files.length>3){
        alert('more than 3 files added');
        return false;
    }
    for(let i=0;i<files.length;i++){
        var file=files[i];
        formData.append('photos[]',file,file.name);

    }
    
    
    formData.forEach(function(dataValue,key,parent){
        console.log('Data Value ',dataValue);
        console.log('Key ',key);
        console.log('Parent ',parent);
        
        
        
    })

    
    uploadFiles(formData);
})
function handleSuccess(data){
    console.log("data =======> ",data,'  ',data.length);
    
    if(data.length>0){
        var html='';
        for(let i=0;i<data.length;i++){
            var img=data[i];
            if(img.status){
                html+='<div class="col-xs-6 col-md-4"><img src="'+img.publicPath+' " > </div>'
            }else{
                html += '<div class="col-xs-6 col-md-4"><a href="#" class="thumbnail">Invalid file type - ' + img.filename  + '</a></div>';
            }
        
        }
        $('#album').html(html);
    }else{
        alert('NO images Uploaded');
    }

}
$('#inputFile').on('change', function () {
    $('.progress-bar').width('0%');
});

function uploadFiles(formdata){
   
   
   var xhr=new XMLHttpRequest();
   xhr.open('POST','/product');
   xhr.setRequestHeader('data',formdata);
   xhr.addEventListener('progress',function(event){
    var progressBar=$('.progress-bar');
                 if(event.lengthComputable ){
                     var percent=(event.loaded/event.total)*100;
                     progressBar.width(percent+'%');
                     if(percent===100){
                         progressBar.removeClass('active');
                     }
                 }   

    })

   xhr.onreadystatechange=function(){
       console.log(xhr.readyState);
       if(xhr.readyState==4){
           console.log(xhr);
           var myObj=JSON.parse(xhr.responseText)
           for(let i=0;i<myObj.length;i++){
            console.log(myObj);
            window.location='/';
            handleSuccess(myObj);
           }
          
       }
       
   }
   xhr.send(formdata);
   // $.ajax({
    //     url :'/product',
    //     method : 'post',
    //     data:formdata,
    //     processData:false,
    //     contentType:false,
    //     xhr:function(){
    //         var xhr=new XMLHttpRequest();
    //         xhr.upload.addEventListener('progress',function(event){
    //             var progressBar=$('.progress-bar');
    //             if(event.lengthComputable ){
    //                 var percent=(event.loaded/event.total)*100;
    //                 progressBar.width(percent+'%');
    //                 if(percent===100){
    //                     progressBar.removeClass('active');
    //                 }
    //             }
    //         })
    //         return xhr;
    //     }

    // }).done(handleSuccess).fail(function(xhr,status){
    //     alert(status);
    // });
}