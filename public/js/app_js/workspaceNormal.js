var idUser = sessionStorage.getItem('user_id');
var users_details = sessionStorage.getItem('user_details');
var jsonUserDetails = JSON.parse(users_details);

if (jsonUserDetails.type) {
    document.getElementById("workspaceSidebar").innerHTML = '';
}

function handleChangeWorkspace(iterator) {

    var users_details = sessionStorage.getItem('users_details');
    users_details = JSON.parse(users_details);
    sessionStorage.setItem('user_details', JSON.stringify(users_details[iterator]));
    sessionStorage.setItem('user_id', JSON.stringify(users_details[iterator].idUser));
    sessionStorage.setItem('user_name', JSON.stringify(users_details[iterator].name));
    window.location.href = "home";

}
function loadDropdown() {
    var users_details = sessionStorage.getItem('users_details');
    var array = JSON.parse(users_details);
    var htmlToAdd = "";

    for (i = 0; i < array.length; i++) {

        htmlToAdd += '<a class="dropdown-item d-flex align-items-center" href="#" onclick ="handleChangeWorkspace(' + i + ')"><div>';
        htmlToAdd += '<span class="font-weight-bold" >' + array[i].name + '</span>';
        htmlToAdd += '</div></a>';
    }
    document.getElementById("workspacesPerUser").innerHTML = htmlToAdd;
}
function deleteNotification(id){
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/users/deleteNotifications/" + id,
        success: function (data) {
            loadNotification();
        }
    });
}

function loadNotification() {
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/users/notifications/" + idUser,
        success: function (data) {
            var htmlToAdd = "";
            document.getElementById("countNotifications").innerHTML = data.result.length;

            for (i = 0; i < data.result.length; i++) {
                htmlToAdd += '<a class="dropdown-item d-flex align-items-center" href="#" onclick="deleteNotification('+data.result[i].idnotifications+')">';
                if (data.result[i].type == 0) {
                    htmlToAdd += '<div class="mr-3"><div class="icon-circle bg-primary"><i class="far fa-thumbs-up text-white"></i>';
                } else if (data.result[i].type == 1) {
                    htmlToAdd += '<div class="mr-3"><div class="icon-circle bg-info"><i class="fas fa-check text-white"></i>';
                } else if (data.result[i].type == 2) {
                    htmlToAdd += '<div class="mr-3"><div class="icon-circle bg-warning"><i class="fas fa-wifi text-white"></i>';
                } else if (data.result[i].type == 3) {
                    htmlToAdd += '<div class="mr-3"><div class="icon-circle bg-warning"><i class="fas fa-filter text-white"></i>';
                }

                htmlToAdd += '</div></div><div>';
                
                htmlToAdd += '<span class="font-weight-bold">' + data.result[i].description + '</span>';
                htmlToAdd += '</div></a>';

            }
            document.getElementById("allNotifications").innerHTML = htmlToAdd;
        }
    });
}
loadNotification();
loadDropdown();