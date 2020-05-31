var xhr=new XMLHttpRequest();
var url="https://api.covid19india.org/state_district_wise.json"
xhr.addEventListener('progress',function(event){
    console.log(event);
   console.log(event.lengthComputable); 
});
xhr.onreadystatechange=function(){
    console.log(xhr.readyState);
    if(xhr.readyState==4){
       console.log(xhr.responseText);
        //console.log(xhr);
        var myobj=JSON.parse(xhr.responseText);
       // console.log(myobj.raw_data.length);
        var html='';
        var states={}
        var allindiaCases=0
        for(state in myobj){
            console.log(myobj[state]);
                var totalcases=0;
                var activeCases=0;
                var deceased=0;
                var recovered=0;

                console.log(myobj[state]['districtData']);
                for(district in myobj[state]['districtData']){
               //     console.log(myobj[state]['districtData'][district]);
                    var disObj=myobj[state]['districtData'][district]
               //     console.log(state,district,disObj);
                    totalcases+=disObj['confirmed'];
                    activeCases+=disObj['active'];
                    deceased+=disObj['deceased'];
                    recovered+=disObj['recovered'];
                }
 console.log('=======================>',state,totalcases,'===',activeCases,'  ',deceased,'  ',recovered);
              states[state]={
                  totalcases:totalcases,
                  activeCases:activeCases,
                  recovered:recovered,
                  deceased:deceased
              }
             
              
              allindiaCases+=totalcases
                

            
            
        }
        console.log(states);
        
        console.log(allindiaCases);
        
        var i=1;
        for(state in states){
              //  console.log(states[state]);

                html+="<tr><th scope='row'>"
                +i+"</th> <td>"+state+
                "</td><td>"+states[state]['totalcases']+"</td>"
                +"<td>"+states[state]['activeCases']+"</td><td>"               
                +states[state]['recovered']+"</td><td>"+states[state]['deceased']
                +"</td></tr>"
                ;
                
                i++;
            
        }
        document.getElementById('tablebody').insertAdjacentHTML('afterbegin',html)
        
        
        
    }
}
xhr.open("GET",url);
xhr.send();



