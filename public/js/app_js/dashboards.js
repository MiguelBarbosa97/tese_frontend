var idUser = sessionStorage.getItem('user_id');

function changeState(id){
    event.stopPropagation()
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/dashboard/publicprivate/" + id,
        success: function (data) {
       
            loadLists();
        }
    });
}
function presentation(guid, id){
    event.stopPropagation()
    sessionStorage.setItem('id_dashboard', id);

    window.open(
        "presentation?id="+guid+'&type=1',
        '_blank' 
      );
}

function editFullScreen(guid, id){
    event.stopPropagation()
    sessionStorage.setItem('id_dashboard', id);
    window.open(
        "presentation?id="+guid+'&type=0',
        '_blank' 
      );
}

function deleteDashboard(id) {
    event.stopPropagation()

    $.ajax({
        type: "DELETE",
        contentType: 'application/json',
        url: "http://localhost:8080/dashboard/delete/" + id,
        success: function (data) {
            Swal.fire({
                position: 'top-end',
                title: "Deleted",
                showConfirmButton: false,
                timer: 1000
            });
            loadLists();
        }
    });


}

function loadLists() {
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/dashboard/getDashboards/" + idUser,
        success: function (data) {
            var htmlToAdd = "";

            for (i = 0; i < data.result.length; i++) {
                // onclick="openDashboard(' + data.result[i].idDashboard + ')"
                htmlToAdd += '<a  class="list-group-item list-group-item-action flex-column align-items-start">';
                htmlToAdd += '<div class="d-flex w-100 justify-content-between">';
                htmlToAdd += '<h5 class="mb-1"><span class="badge badge-primary badge-pill">' + data.result[i].idDashboard + '</span>' + data.result[i].dashboardName + '</h5>';
                htmlToAdd += '<small class="text-muted">' + data.result[i].days + ' days ago</small></div>';
                for (p = 0; p < data.result[i].vizs.length; p++) {
                    htmlToAdd += '<p class="mb-1"><span class="badge badge-info badge-pill">' + data.result[i].vizs[p].id + '</span>' + data.result[i].vizs[p].name + '</p>';
                }

                if (data.result[i].ispublic == false) {
                    htmlToAdd += '<i class="far fa-eye-slash" onclick="changeState(' + data.result[i].idDashboard + ')"></i><small>Private    </small>';
                } else {
                    htmlToAdd += '<i class="fas fa-eye" onclick="changeState(' + data.result[i].idDashboard + ')"></i><small>Public    </small>';
                } 
                htmlToAdd += '<i class="fas fa-expand-arrows-alt" onclick="editFullScreen(\'' + data.result[i].guid + '\','+data.result[i].idDashboard +')"></i> <small> Edit full screen </small>';
                htmlToAdd += '<i class="far fa-bookmark" onclick="presentation(\'' + data.result[i].guid + '\','+data.result[i].idDashboard +')"></i> <small> Presentation mode </small>';
                htmlToAdd += '<span style="float:right;" onclick="deleteDashboard(' + data.result[i].idDashboard + ')"><i class="fas fa-trash"></i></span>';

                htmlToAdd += '</a>';
            }
            document.getElementById("dashList").innerHTML = htmlToAdd;
        }
    });
}

function getLoad(idUser) {
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/dashboard/getVizs/" + idUser,
        success: function (data) {
            var htmlAdd = '';
            for (var i = 0; i < data.result.length; i++) {


                htmlAdd += '<tr> <td> <div class="custom-control custom-checkbox">';
                htmlAdd += '<input type="checkbox" class="custom-control-input" name="queryIds[]" id="loadcheck' + i +
                    '" value="' + data.result[i].id + '" >';
                htmlAdd += '<label class="custom-control-label" for="loadcheck' + i + '"></label></div></td>';
                htmlAdd += '<td>' + data.result[i].name + '</td></tr>';

            }

            document.getElementById("tableLoad").innerHTML = htmlAdd;
        }
    });
}
loadLists();
getLoad(idUser);

$("#createDashboard").click(function () {
    var allChecks = document.getElementsByName('queryIds[]');
    var charts = [];
    for (var i = 0; i < allChecks.length; i++) {
        if (allChecks[i].checked == true) {

            charts.push(allChecks[i].value);
        }
    }

    var req = {
        "id_user": idUser,
        "id_vizs": charts
    };
    $.ajax({
        type: "POST",
        contentType: 'application/json',
        url: "http://localhost:8080/dashboard/create",
        data: JSON.stringify(req),
        success: function (data) {
            loadLists();

            Swal.fire({
                position: 'top-end',
                title: "Created",
                showConfirmButton: false,
                timer: 1000
            })
            loadLists();

            $('#loadModal').modal('hide');
        }
    });

});
function openDashboard(id) {

    sessionStorage.setItem('id_dashboard', id);
    window.location.href = "dashboard";

}
