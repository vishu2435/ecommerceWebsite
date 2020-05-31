// $(".fas").on('click',function(e){
//     $(".fas").toggle({
//         function(){$(".fas").css({"color":"red"});},
//         function(){$(".fas").css({"color":"green"});}
//     })
// })

var selectedItems=0;
const changeAllToRed=()=>{
    selectedItems=0;
    for(let i=0;i<elements.length;i++){
        elements[i].style.color="red";
        if(elements[i].childNodes[0]){
            if(elements[i].childNodes[0].value!="All"){
                console.log(elements[i].childNodes[0].value);
                
                selectedItems+=parseInt(elements[i].childNodes[0].value);
            }
        }
        
       
        
    }    
  
    
    
}
const changeAllToBlack=()=>{
    for(let i=0;i<elements.length;i++){
        elements[i].style.color="Black";
    }    
    selectedItems=0
}
const changeFootBar=()=>{
    document.getElementById('footBar').innerText=selectedItems;
}
var elements=document.getElementsByClassName('fas');
var cbFunction=(elem)=>{
    if(elem.currentTarget.childNodes[0].value=="All"){
        console.log(elem.currentTarget.childNodes[2].value);
        
        if(elem.currentTarget.style.color=="red"){
            
            changeAllToBlack();
            
        }else{
            changeAllToRed();
        }   
        changeFootBar(); 
        return;
    }
    if(elem.currentTarget.style.color=="red"){
        console.log(elem.currentTarget.childNodes[0].value);
        selectedItems-=parseInt(elem.currentTarget.childNodes[0].value);
        elem.currentTarget.style.color="black"
        
    }else{
        elem.currentTarget.style.color="red"
        console.log(elem.currentTarget.childNodes[0].value);
        
    //    var val=JSON.parse(elem.currentTarget.childNodes[1].value);
    //    console.log(val);
       
        selectedItems+=parseInt(elem.currentTarget.childNodes[0].value);
        
    }

    changeFootBar();
    
}
for(let i=0;i<elements.length;i++){
    elements[i].addEventListener('click',cbFunction);
}