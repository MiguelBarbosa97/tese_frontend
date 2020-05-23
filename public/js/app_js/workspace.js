var idUser = sessionStorage.getItem('user_id');
var userName = sessionStorage.getItem('user_name');

function shareWorkspace(id){
    document.getElementById("workstreamId").value= id;
    $("#loadModaluser").modal()
}

function loadLists() {
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/workspace/getWorkspaceUsers/" + idUser,
        success: function (data) {
            var htmlToAdd = "";

            for (i = 0; i < data.result.length; i++) {
                var input = data.result[i].createOn;
                var fields = input.split('T');
                htmlToAdd += '<a class="list-group-item list-group-item-action flex-column align-items-start">';
                htmlToAdd += '<div class="d-flex w-100 justify-content-between">';
                htmlToAdd += '<h5 class="mb-1">' + data.result[i].workspaceName + '</h5>';
                htmlToAdd += '<small class="text-muted">' + fields[0] + ' </small></div>';
                for (p = 0; p < data.result[i].allUsers.length; p++) {
                    htmlToAdd += '<p class="mb-1">' + data.result[i].allUsers[p]+ '</p>';
                }

                htmlToAdd += '<i class="fas fa-user-shield"></i> <small> ' + data.result[i].createdBy + '</small>';
                if(userName.slice(1,-1) == data.result[i].createdBy){
                    htmlToAdd += '<span style="float:right;" onclick="shareWorkspace(' + data.result[i].workspaceId + ')"><i class="fas fa-share-alt"></i></span>';
                }

                htmlToAdd += '</a>';
            }
            document.getElementById("workList").innerHTML = htmlToAdd;
        }
    });
}

function getLoad(idUser) {
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/users/getUsersToShare/" + idUser,
        success: function (data) {
            var htmlAdd = '';
            for (var i = 0; i < data.result.length; i++) {


                htmlAdd += '<tr> <td> <div class="custom-control custom-checkbox">';
                htmlAdd += '<input type="checkbox" class="custom-control-input" name="queryIds[]" id="loadcheck' + i +
                    '" value="' + data.result[i].iduser + '" >';
                htmlAdd += '<label class="custom-control-label" for="loadcheck' + i + '"></label></div></td>';
                htmlAdd += '<td>' + data.result[i].username + '</td></tr>';

            }

            document.getElementById("tableLoad").innerHTML = htmlAdd;
        }
    });
}

$("#createWorkspace").click(function () {
console.log("s");
    var req = {
        "idUser": idUser,
        "name": document.getElementById("workspace_name").value
    };
    $.ajax({
        type: "POST",
        contentType: 'application/json',
        url: "http://localhost:8080/workspace/createWorkspace",
        data: JSON.stringify(req),
        success: function (data) {
            loadLists();

            Swal.fire({
                position: 'top-end',
                title: "Created",
                showConfirmButton: false,
                timer: 1000
            })
            $('#loadModal').modal('hide');
        }
    });

});



$("#shareWorkspace").click(function () {
    var allChecks = document.getElementsByName('queryIds[]');
    var users = [];
    for (var i = 0; i < allChecks.length; i++) {
        if (allChecks[i].checked == true) {

            users.push(allChecks[i].value);
        }
    }

    var req = {
        "idworspace": document.getElementById('workstreamId').value,
        "iduser": users
    };
    console.log(JSON.stringify(req));
    $.ajax({
        type: "POST",
        contentType: 'application/json',
        url: "http://localhost:8080/workspace/shareWorkspace",
        data: JSON.stringify(req),
        success: function (data) {
            loadLists();

            Swal.fire({
                position: 'top-end',
                title: "Shared",
                showConfirmButton: false,
                timer: 1000
            })

            $('#loadModaluser').modal('hide');
        }
    });

});

loadLists();
getLoad(idUser);