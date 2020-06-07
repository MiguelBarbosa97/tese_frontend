var id = location.search.split('id=')[1];
var idUser = sessionStorage.getItem('user_id');

function subscribeViz() {
    var idMarket = id;
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/market/subViz/" + idUser + "/" + idMarket,
        success: function (data) {

            Swal.fire({
                position: 'top-end',
                title: "Subscribe",
                showConfirmButton: false,
                timer: 1000
            })
            window.location.href = "/market";

        },
        error: function (error) {
            console.log(error);
            Swal.fire({
                position: 'top-end',
                title: "Error",
                showConfirmButton: false,
                timer: 1000
            })
        },
    });
}

document.getElementById("chartID").innerHTML= id;
$.ajax({
    type: "GET",
    contentType: 'application/json',
    url: "http://localhost:8080/market/getAllMarket",
    success: function (data) {

        for(var i= 0; i < data.result.allViz.length; i++){
            console.log(data.result.allViz[i].idVizMarket);
            if(data.result.allViz[i].idVizMarket == id){
                var element = data.result.allViz[i];
                document.getElementById('contentFrame').src = "data:text/html;charset=utf-8," + escape(element.chart);
                document.getElementById("description").innerHTML=element.description;
                document.getElementById("likes").innerHTML=element.likes;
                document.getElementById("used").innerHTML=element.used;
                document.getElementById("username").innerHTML=element.username;
                document.getElementById("date").innerHTML=element.date;

                document.getElementById("totalCharts").innerHTML=element.totalCharts;
                document.getElementById("marketCharts").innerHTML=element.marketCharts;
                document.getElementById("totalLikes").innerHTML=element.totalLikes;
                document.getElementById("totalUsed").innerHTML=element.totalUsed;

                tagsHtml= '';
                for(var p = 0; p< element.tags.length; p++){
                    tagsHtml += '<span class="badge badge-primary">'+element.tags[p]+'</span> ';
                }
                for(var p = 0; p< element.tagsSecundary.length; p++){
                    tagsHtml += '<span class="badge badge-secondary">'+element.tagsSecundary[p]+'</span> ';
                }
                
                document.getElementById("tags").innerHTML=tagsHtml;

            } 
        }
    }
});