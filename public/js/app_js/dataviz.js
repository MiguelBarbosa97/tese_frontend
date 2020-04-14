$(document).ready(function () {

    $("#create").click(function () {
    console.log("s");
    var user_id = sessionStorage.getItem('user_id');

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

});