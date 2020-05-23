var idUser = sessionStorage.getItem('user_id');
var users_details = sessionStorage.getItem('user_details');
var jsonUserDetails =JSON.parse(users_details);
if(jsonUserDetails.type){
    document.getElementById("workspaceSidebar").innerHTML= '';
}

function handleChangeWorkspace(iterator){
    var users_details = sessionStorage.getItem('users_details');
    users_details =JSON.parse(users_details);
    sessionStorage.setItem('user_details', JSON.stringify(users_details[iterator]));
    sessionStorage.setItem('user_id', JSON.stringify(users_details[iterator].iduser));
    sessionStorage.setItem('user_name', JSON.stringify(users_details[iterator].name));
    window.location.href = "home";
}

function loadDropdown(){
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/workspace/getWorkstreamDropdown/" + idUser,
        success: function (data) {
            var htmlToAdd = "";
            sessionStorage.setItem('users_details', JSON.stringify(data.result));

            for (i = 0; i < data.result.length; i++) {
  
                htmlToAdd += '<a class="dropdown-item d-flex align-items-center" href="#" onclick ="handleChangeWorkspace('+i+')"><div>';
                htmlToAdd += '<span class="font-weight-bold" >'+data.result[i].name+'</span>';
                htmlToAdd += '</div></a>';
            }
            document.getElementById("workspacesPerUser").innerHTML = htmlToAdd;
        }
    });
} 

loadDropdown();