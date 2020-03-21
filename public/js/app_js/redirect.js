$(document).ready(function () {
    // const Swal = require('sweetalert2')
    // import Swal from 'sweetalert2'
    var user_details = sessionStorage.getItem('user_details');
    // var user_details = JSON.stringify(user_details2) ;

    if(user_details == null){
        window.location=("http://localhost:9000");
    }else{

        var user_name = sessionStorage.getItem('user_name');

        $("#full_name_user").text(''+user_name.slice(1, -1));

        
    }

    
    $("#logout").click(function () {

        sessionStorage.clear()
        window.location=("http://localhost:9000");

    });
});