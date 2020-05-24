var user_id = sessionStorage.getItem('user_id');

function editViz(e) {
    sessionStorage.setItem('viz_id', e);
    window.location.href = "visualization";

}

function shareViz(viz_id) {

    document.getElementById("idViz").value = viz_id;

    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/market/getCategories",
        success: function (data) {

            var select = document.getElementById("categories");

            for (var i = 0; i < data.result.length; i++) {

                var option = document.createElement('option');
                option.text = data.result[i].description;
                option.value = data.result[i].idcategory;
                select.add(option, 0);
            }

            $("#shareModal").modal();

        }
    });

}

function deleteViz(e) {

    $.ajax({
        type: "DELETE",
        contentType: 'application/json',
        url: "http://localhost:8080/viz/deleteViz/" + user_id + "/" + e,
        success: function (data) {
            loadPage();
        }
    });
}

function cloneViz(e) {
    console.log(e);
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/viz/cloneViz/" + user_id + "/" + e,
        success: function (data) {
            loadPage();

        }
    });
}

function loadPage() {
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/viz/getAllViz/" + user_id,
        success: function (data) {
            var allValues = data.result;
            var htmlToAdd = '';
            for (var i = 0; i < allValues.length; i++) {
                htmlToAdd += '<div class="row">';
                var allValuesSecondLevel = allValues[i];
                for (var p = 0; p < allValuesSecondLevel.length; p++) {
                    var type = 'dark';
                    if (allValuesSecondLevel[p].type == 1) {
                        type = 'primary';
                    } else if (allValuesSecondLevel[p].type == 2) {
                        type = 'warning';
                    } else if (allValuesSecondLevel[p].type == 3) {
                        type = 'success';
                    }

                    htmlToAdd += '<div class="col-xl-3 col-md-6 mb-4">';
                    htmlToAdd += '<div class="card border-left-' + type + ' shadow h-100 py-2">';
                    htmlToAdd += '<div class="card-body">';
                    htmlToAdd += '<div class="row no-gutters align-items-center">';
                    htmlToAdd += '<div class="col mr-2">';
                    htmlToAdd += '<iframe frameBorder="0" id = "output_iframe' + i + '-' + p + '"></iframe>';
                    htmlToAdd += '</div>';
                    htmlToAdd += '<div class="col-auto">';
                    htmlToAdd += '<div class="row">';
                    htmlToAdd += '<a onclick="editViz(' + allValuesSecondLevel[p].idViz + ')"><i class="fas fa-edit fa-2x text-gray-600"></i></a>';
                    htmlToAdd += '</div><br>';
                    htmlToAdd += '<div class="row">';
                    htmlToAdd += '<a onclick="cloneViz(' + allValuesSecondLevel[p].idViz + ')"><i class="fas fa-copy fa-2x text-gray-600"></i></a>';
                    htmlToAdd += '</div><br>';
                    htmlToAdd += '<div class="row">';
                    if (allValuesSecondLevel[p].type == 2) {
                        htmlToAdd += '<a><i class="fas fa-share-alt fa-2x text-gray-600 isDisabled"></i></a>';
                    } else if (allValuesSecondLevel[p].type == 3) {
                        htmlToAdd += '<a><i class="fas fa-share-alt fa-2x text-gray-600 isDisabled"></i></a>';
                    } else {
                        htmlToAdd += '<a onclick="shareViz(' + allValuesSecondLevel[p].idViz + ')"><i class="fas fa-share-alt fa-2x text-gray-600"></i></a>';
                    }
                    htmlToAdd += '</div><br>';
                    htmlToAdd += '<div class="row">';
                    if (allValuesSecondLevel[p].type == 2) {
                        htmlToAdd += '<a><i class="fas fa-trash fa-2x text-gray-600 isDisabled"></i></a>';
                    } else if (allValuesSecondLevel[p].type == 3) {
                        htmlToAdd += '<a><i class="fas fa-trash fa-2x text-gray-600 isDisabled"></i></a>';
                    } else {
                        htmlToAdd += '<a onclick="deleteViz(' + allValuesSecondLevel[p].idViz + ')"><i class="fas fa-trash fa-2x text-gray-600"></i></a>';
                    }
                    htmlToAdd += '</div></div></div></div></div></div>'
                }
                htmlToAdd += '</div>';
            }
            document.getElementById("htmlToInsert").innerHTML = htmlToAdd;

            for (var i = 0; i < allValues.length; i++) {
                var allValuesSecondLevel = allValues[i];
                for (var p = 0; p < allValuesSecondLevel.length; p++) {
                    document.getElementById('output_iframe' + i + '-' + p).src = "data:text/html;charset=utf-8," + escape(allValuesSecondLevel[p].all);

                }
            }
        }
    });
}

$(document).ready(function () {
    $('[data-toggle="popover"]').popover();

    $("#create").click(function () {

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
    $("#shareMarket").click(function () {

        var viz_id = document.getElementById("idViz").value;
        var description = document.getElementById("description").value;
        var e = document.getElementById("categories");
        var strUser = e.options[e.selectedIndex].value;
        var tags = document.getElementById("multiTag").value;
        var reqJson = {
            "idViz": viz_id,
            "idCategory": strUser,
            "description": description,
            "idUser": user_id,
            "tags": tags
        }

        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: "http://localhost:8080/market/share",
            data: JSON.stringify(reqJson),
            success: function (data) {
                Swal.fire({
                    position: 'top-end',
                    title: JSON.stringify(data.message).slice(1, -1),
                    showConfirmButton: false,
                    timer: 1000
                })
                loadPage();
                $('#shareModal').modal('hide');

            },
            error: function (error) {
                console.log(error);
                Swal.fire({
                    position: 'top-end',
                    title: JSON.stringify(data.message).slice(1, -1),
                    showConfirmButton: false,
                    timer: 1000
                })
            },
        });

    });

    loadPage();

});