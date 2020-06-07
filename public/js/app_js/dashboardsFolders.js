var idUser = sessionStorage.getItem('user_id');

function changeState(id, namespace) {
    event.stopPropagation()
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/dashboard/publicprivate/" + id,
        success: function (data) {
            if (namespace == '') {
                namespace = 'Root';
            }
            selectFolder(namespace);
        }
    });
}
function presentation() {
    var id = document.getElementById("idDashboard").value;
    var guid = document.getElementById("guid").value;

    sessionStorage.setItem('id_dashboard', id);
    window.open(
        "presentation?id=" + guid + '&type=1',
        '_blank'
    );
}
function editFullScreen() {
    var id = document.getElementById("idDashboard").value;
    var guid = document.getElementById("guid").value;
    var req = {
        "idDashboard": id,
        "description": "",
        "type": 1,
        "idUser": idUser
    };

    $.ajax({
        type: "POST",
        contentType: 'application/json',
        url: "http://localhost:8080/dashboard/logs",
        data: JSON.stringify(req),
        success: function (data) {
            sessionStorage.setItem('id_dashboard', id);
            window.location.href = "/presentation?id=" + guid + '&type=0';

        }
    });
}
function deleteDashboard() {
    var id = document.getElementById("idDashboard").value;

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
            selectFolder("Root");
        }
    });


}
function openDetails(id) {
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/dashboard/getDashboardsDetails/" + id,
        success: function (data) {
            document.getElementById("modalHeader").innerHTML = data.result.dashboardName;
            document.getElementById("createdOnLabel").innerHTML = data.result.createdOn;
            document.getElementById("createdByLabel").innerHTML = data.result.createdBy;
            document.getElementById("modifiedLabel").innerHTML = data.result.days + " days ago";
            document.getElementById("numberChartsLabel").innerHTML = data.result.vizs.length;
            document.getElementById("idDashboard").value = data.result.idDashboard;
            document.getElementById("guid").value = data.result.guid;

            htmlBadges = "";
            for (var i = 0; i < data.result.vizs.length; i++) {
                var element = data.result.vizs[i];
                htmlBadges += '<span class="badge badge-secondary">' + element.name + '</span> ';
            }
            document.getElementById("chartsBadges").innerHTML = htmlBadges;

            htmlListAdd = "";
            for (var i = 0; i < data.result.logs.length; i++) {
                var element = data.result.logs[i];
                htmlListAdd += '<li class="list-group-item">' + element + '</li>';
            }
            document.getElementById("listLogs").innerHTML = htmlListAdd;
            $("#exampleModal1").modal("show");
        }
    });


}
function selectFolder(id) {
    var htmlToAdd = '<a onclick="selectFolder(\'Root\')"><i class="fas fa-folder"></i> Root / </a>';

    if (id != 'Root') {
        var fields = id.split(',');
        for (var i = 0; i < fields.length; i++) {
            var path = fields.slice(0, i).join();
            if (path == '') {
                path = fields[i];
            } else {
                path = path + "," + fields[i];
            }
            htmlToAdd += '<a onclick="selectFolder(\'' + path + '\')"> ' + fields[i] + ' /</a>';
        }
    }

    document.getElementById("pathsFolders").innerHTML = htmlToAdd;
    loadTable(id);
}
function loadTable(namespace) {
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/dashboard/getDashboardsFolders/" + idUser + "/" + namespace,
        success: function (data) {
            var htmlToAdd = "";
            var list = data.result;
            for (var i = 0; i < list.length; i++) {
                if (list[i].folder == true) {
                    htmlToAdd += '<tr onclick="selectFolder(\'' + list[i].namespace + '\')">'
                    htmlToAdd += '<td><i class="fas fa-folder"></i> ' + list[i].name + '</td>'
                    htmlToAdd += '<td>' + list[i].lasModifiedby + '</td>';
                    htmlToAdd += '<td>' + list[i].lastModifiedon + '</td><td></td></tr>';
                } else {
                    htmlToAdd += '<tr onclick="openDetails(' + list[i].idDash + ')"><td><i class="fas fa-chart-line"></i> ' + list[i].name + '</td>';
                    htmlToAdd += '<td>' + list[i].lasModifiedby + '</td>';
                    htmlToAdd += '<td>' + list[i].lastModifiedon + '</td>';
                    if (list[i].ispublic) {
                        htmlToAdd += '<td><i class="far fa-eye" rel="tooltip" title="Dashboard permission" onclick="changeState(' + list[i].idDash + ', \'' + list[i].namespace + '\')"></i>';
                    } else {
                        htmlToAdd += '<td><i class="far fa-eye-slash" rel="tooltip" title="Dashboard permission" onclick="changeState(' + list[i].idDash + ', \'' + list[i].namespace + '\')"></i>';
                    }
                    htmlToAdd += '</td>';
                    htmlToAdd += '</tr>';
                }
            }
            document.getElementById("tableFolders").innerHTML = htmlToAdd;
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

loadTable("Root");
getLoad(idUser);

$("#createDashboard").click(function () {
    var allChecks = document.getElementsByName('queryIds[]');
    var dashboardName = document.getElementById("dashboardName").value;
    var tags = document.getElementById("multiTag").value;
    var charts = [];
    for (var i = 0; i < allChecks.length; i++) {
        if (allChecks[i].checked == true) {

            charts.push(allChecks[i].value);
        }
    }

    var req = {
        "id_user": idUser,
        "id_vizs": charts,
        "dashboardName": dashboardName,
        "namespace": tags,
    };

    $.ajax({
        type: "POST",
        contentType: 'application/json',
        url: "http://localhost:8080/dashboard/create",
        data: JSON.stringify(req),
        success: function (data) {

            Swal.fire({
                position: 'top-end',
                title: "Created",
                showConfirmButton: false,
                timer: 1000
            });
            if (tags == "") {
                tags = "Root";
            }
            selectFolder(tags);

            $('#loadModal').modal('hide');
        }
    });

});

$("#addCommentSave").click(function () {
    var idDashboard = document.getElementById("idDashboard").value;
    var logDescription = document.getElementById("logDescription").value;
    
    var req = {
        "idDashboard": idDashboard,
        "description":logDescription,
        "type":2,
        "idUser":idUser
    };

    $.ajax({
        type: "POST",
        contentType: 'application/json',
        url: "http://localhost:8080/dashboard/logs",
        data: JSON.stringify(req),
        success: function (data) {
            document.getElementById("logDescription").setAttribute("hidden", true);
            document.getElementById("saveButton").setAttribute("hidden", true);

            openDetails(idDashboard);
        }
    });

});