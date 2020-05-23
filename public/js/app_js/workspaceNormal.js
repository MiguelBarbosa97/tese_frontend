var idUser = sessionStorage.getItem('user_id');
function handleChangeWorkspace(iterator){

    var users_details = sessionStorage.getItem('users_details');
    users_details = JSON.parse(users_details);
    sessionStorage.setItem('user_details', JSON.stringify(users_details));
    sessionStorage.setItem('user_id', JSON.stringify(users_details[iterator].idUser));
    sessionStorage.setItem('user_name', JSON.stringify(users_details[iterator].name));
    window.location.href = "home";

}
function loadDropdown(){
    var users_details = sessionStorage.getItem('users_details');
    var array = JSON.parse(users_details);
    var htmlToAdd = "";

    for (i = 0; i < array.length; i++) {

        htmlToAdd += '<a class="dropdown-item d-flex align-items-center" href="#" onclick ="handleChangeWorkspace('+i+')"><div>';
        htmlToAdd += '<span class="font-weight-bold" >'+array[i].name+'</span>';
        htmlToAdd += '</div></a>';
    }
    document.getElementById("workspacesPerUser").innerHTML = htmlToAdd;
} 

loadDropdown();