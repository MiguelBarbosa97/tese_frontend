var guid = location.search.split('id=')[1];
var idUser = sessionStorage.getItem('user_id');

if (idUser == undefined) {
    idUser = 0;
}

$.ajax({
    type: "GET",
    contentType: 'application/json',
    url: "http://localhost:8080/dashboard/checkPresentation/"+ idUser +"/"+guid,
    success: function (data) {
        var htmlError = '';

        if (data.message == "200") {
            console.log("deu bem");
        } else if (data.message == "401"){
            htmlError += '<div class="text-center">';
            htmlError += '<div class="error mx-auto" data-text="401">401</div>';
            htmlError += '<p class="lead text-gray-800 mb-5">Not Authorized</p>';
            htmlError += '<p class="text-gray-500 mb-0">Please contact the owner to provide you access...</p></div>';
            
            console.log("Not authorized");
        }else{

            htmlError += '<div class="text-center">';
            htmlError += '<div class="error mx-auto" data-text="404">404</div>';
            htmlError += '<p class="lead text-gray-800 mb-5">Page Not Found</p>';
            htmlError += '<p class="text-gray-500 mb-0">It looks like you found a glitch in the matrix...</p></div>';
            
            console.log("not found");
        }
        document.getElementById("contentError").innerHTML= htmlError;


    }
});
