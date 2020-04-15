var user_id = sessionStorage.getItem('user_id');

function editViz(e) {
    sessionStorage.setItem('viz_id', e);
    window.location.href = "visualization"; 

}
function deleteViz(e) {

    $.ajax({
        type: "DELETE",
        contentType: 'application/json',
        url: "http://localhost:8080/viz/deleteViz/" + user_id + "/" + e,  
        success: function (data) {
            loadPage();
        }
      });
}

function cloneViz(e){
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/viz/cloneViz/" + user_id + "/" + e,  
        success: function (data) {
            loadPage();
         
        }
      });
}

function loadPage(){
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/viz/getAllViz/" + user_id,  
        success: function (data) {
            var allValues = data.result;
            var htmlToAdd = '';
            for(var i = 0; i< allValues.length; i++){
                htmlToAdd += '<div class="row">';
                var allValuesSecondLevel = allValues[i];
                for(var p = 0; p< allValuesSecondLevel.length; p++){
                    var type = 'dark';
                    if(allValuesSecondLevel[p].type == 1){
                        type= 'primary';
                    }

                    htmlToAdd += '<div class="col-xl-3 col-md-6 mb-4">';
                    htmlToAdd += '<div class="card border-left-'+type+' shadow h-100 py-2">';
                    htmlToAdd += '<div class="card-body">';
                    htmlToAdd += '<div class="row no-gutters align-items-center">';
                    htmlToAdd += '<div class="col mr-2">';
                    htmlToAdd += '<iframe frameBorder="0" srcdoc="'+allValuesSecondLevel[p].all+'"></iframe>';
                    htmlToAdd += '</div>';
                    htmlToAdd += '<div class="col-auto">';
                    htmlToAdd += '<div class="row">';
                    htmlToAdd += '<a onclick="editViz('+allValuesSecondLevel[p].idViz+')"><i class="fas fa-edit fa-2x text-gray-600"></i></a>';
                    htmlToAdd += '</div><br>';
                    htmlToAdd += '<div class="row">';
                    htmlToAdd += '<a onclick="cloneViz('+allValuesSecondLevel[p].idViz+')"><i class="fas fa-copy fa-2x text-gray-600"></i></a>';
                    htmlToAdd += '</div><br>';
                    htmlToAdd += '<div class="row">';
                    htmlToAdd +='<a onclick="deleteViz('+allValuesSecondLevel[p].idViz+')"><i class="fas fa-trash fa-2x text-gray-600"></i></a>';
                    htmlToAdd += '</div></div></div></div></div></div>'
                }
                htmlToAdd += '</div>';
            }
            document.getElementById("htmlToInsert").innerHTML = htmlToAdd;

        }
      });
}

$(document).ready(function () {
    $('[data-toggle="popover"]').popover();   

    $("#create").click(function () {

    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/viz/createViz/" + user_id,  
        success: function (data) {

            sessionStorage.setItem('viz_id', data.result);
            window.location.href = "visualization"; 


        }
      });

    });

    loadPage();

});