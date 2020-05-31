

$(document).ready(function(){
    $('#contactForm').on('submit',function(e){
        e.preventDefault();
        
        console.log($(e.currentTraget));

    });
    $('#in1').on("focus",function(e){
        console.log(e);
        
    })
    $('#in1').on("blur",function(e){
        console.log(e);
        
    })



})

var statePressed=false;
const text=document.querySelector('#itInHome_btn2').innerHTML
var statePressedObject={};





for(let i=0;i<document.getElementsByClassName('itApplications').length;i++){
   var elementId=document.getElementsByClassName('itApplications')[i].getAttribute('id')
    statePressedObject[elementId]={
        state:false,
        div_image:'itInHomeImage_'+elementId,
        p_textBox:'itInHome_'+elementId,
        div_textBox:'itInHomeText_'+elementId
    };
    var additionalId=elementId+"_additionalText";
        
    var htmlElement="<p style='display:none;' id='"+additionalId +"'>"+text+text+"</p>";
    console.log(htmlElement);
    console.log(statePressedObject[elementId]['p_textBox']);
    document.querySelector("#"+statePressedObject[elementId]['p_textBox']).insertAdjacentHTML("afterend",htmlElement);

    document.getElementsByClassName('itApplications')[i].addEventListener('click',function(){
        expand(document.getElementsByClassName('itApplications')[i].getAttribute('id'))
        console.log(this.id);
    });

}
 console.log(statePressedObject);
 var idOfAdditionalElement="";
const expand=(id)=>{
    console.log("#"+statePressedObject[id]['div_image']);
       
//    document.querySelector("#"+statePressedObject[id]['div_image']).classList.toggle('col-lg-12');
        
 //   document.querySelector("#"+statePressedObject[id]['div_textBox']).classList.toggle('col-lg-12');
        
        console.log(id);
        
       if(!statePressedObject[id]['state']){
        let additionalId=id+"_additionalText";
        
       
        let Id="#"+additionalId;
        console.log(Id);
        $(Id).slideDown(500);
        idOfAdditionalElement=Id;
        document.querySelector("#"+id).innerHTML='Know Less';
      
        
        statePressedObject[id]['state']=true;
    }else if(statePressedObject[id]['state']){
        $(idOfAdditionalElement).slideUp(500);
        
        document.querySelector("#"+id).innerHTML='Know More';
        statePressedObject[id]['state']=false
    }

   
   }
 
