$(document).ready(function () {
    // const Swal = require('sweetalert2')
    // import Swal from 'sweetalert2'
    var user_details = sessionStorage.getItem('user_details');

    if(user_details != null){
        window.location=("http://localhost:9000/home");
    }
    
    $("#sign_up_button").click(function () {
        var json_request = {
            name: document.getElementById("name_sign_up").value,
            username: document.getElementById("username_sign_up").value,
            password: document.getElementById("password_sign_up").value,
            password2: document.getElementById("password_repeat_sign_up").value
        }

        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: "http://localhost:8080/users/signup",
            data: JSON.stringify(json_request),
            success: function (data) {
                console.log(JSON.stringify(data));
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: data.message,
                    showConfirmButton: false,
                    timer: 1000
                  })
            },
            error: function (error) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: "Somethin went wrong",
                    showConfirmButton: false,
                    timer: 1000
                  })
            },
        });
    });


    $("#login_button").click(function () {

        var json_request = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
        }
    
        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: "http://localhost:8080/users/login",
            data: JSON.stringify(json_request),
            success: function (data) {
                
                sessionStorage.setItem('user_details', JSON.stringify(data.result));
                sessionStorage.setItem('user_id', JSON.stringify(data.result.iduser));
                sessionStorage.setItem('user_name', JSON.stringify(data.result.name));

                window.location=("http://localhost:9000/home");

            },
            error: function (error) {
                console.log(error);
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: "Somethin went wrong",
                    showConfirmButton: false,
                    timer: 1000
                  })
            },
        });
    
    });
});


