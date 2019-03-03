// import { getEnabledCategories } from "trace_events";

const form = document.getElementById('vote-form');

form.addEventListener('submit',(e)=>{
    const choice =document.querySelector('input[name=os]:checked').value;
    const data = {os:choice}
  
    fetch('/poll/poll',{
        method:'post',
        body:JSON.stringify(data),
        headers: new Headers({
            'Content-Type':"application/json"
        })
    })
    .then(res=>res.json())
    .then(data=>console.log(data))
    .catch(err=>console.log(err));

    e.preventDefault();
})

fetch('/poll/poll')
    .then(res=>res.json())
    .then(data=>{
       
        const votes=data.votes;
        const totalVotes=votes.length;
        const voteCounts=votes.reduce(
            (acc,vote)=>
            ((acc[vote.os]=(acc[vote.os]||0)+parseInt(vote.points)),acc),{});

        let dataPoints=[
            {label:'0-25',y:voteCounts.Firstq},
            {label:'25-50',y:voteCounts.Secondq},
            {label:'50-75',y:voteCounts.Thirdq},
            {label:'75-100',y:voteCounts.Fourthq},
        ];
        
        const chartContainer=document.querySelector('#chartContainer');  
        
        if(chartContainer){
            const chart= new CanvasJS.Chart('chartContainer',{
                animationEnabled:true,
                theme:'theme1',
                title:{
                    text:"Happiness Results"
                },
                data:[
                    {
                        type:'column',
                        dataPoints:dataPoints
                    }
                ]
            });
            chart.render();
        
            Pusher.logToConsole = true;
        
            var pusher = new Pusher('23c2ed96b04945a65169', {
              cluster: 'ap2',
              forceTLS: true
            });
        
            var channel = pusher.subscribe('os-poll');
            channel.bind('os-vote', function(data) {
              dataPoints= dataPoints.map(x=>{
                  if(x.label==data.os){
                      x.y +=data.points;
                      return x;
                  }
                  else{
                      return x;
                  }
              })
              chart.render();
            });
        }
    });

