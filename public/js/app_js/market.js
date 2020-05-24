var idUser = sessionStorage.getItem('user_id');

function likeviz(id) {
    event.stopPropagation();
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/market/likeViz/" + id,
        success: function (data) {
            document.getElementById("likes" + id).innerHTML = data.result;
        }
    });
}

function useChart(id) {
    document.getElementById("marketId").value = id;
    $("#subscribe").modal();
}
function expandViz(index){
    event.stopPropagation();
    
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/market/getAllMarket",
        success: function (data) {
            console.log(index);
            document.getElementById('contentFrame').src = "data:text/html;charset=utf-8," + escape(data.result.allViz[index].chart);
            $("#expand").modal();
        }
    });
}
function subscribeViz() {
    var idMarket = document.getElementById("marketId").value;
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/market/subViz/" + idUser + "/" + idMarket,
        success: function (data) {
            $('#subscribe').modal('hide');
            Swal.fire({
                position: 'top-end',
                title: "Subscribe",
                showConfirmButton: false,
                timer: 1000
            })
        },
        error: function (error) {
            console.log(error);
            Swal.fire({
                position: 'top-end',
                title: "Error",
                showConfirmButton: false,
                timer: 1000
            })
        },
    });
}

function initPage() {
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/market/getAllMarket",
        success: function (data) {

            var htmlToAdd = "";

            var allCategories = data.result.description;
            text = "'all'";
            htmlToAdd += '<button class="btn btn-default filter-button" onclick="filter(' + text + ')">All</button> <a></a>';
            text = "'Recent'";
            htmlToAdd += '<button class="btn btn-default filter-button" onclick="filter(' + text + ')">Recent</button> <a></a>';
            text = "'Popular'";
            htmlToAdd += '<button class="btn btn-default filter-button" onclick="filter(' + text + ')">Popular</button> <a></a>';
            text = "'used'";
            htmlToAdd += '<button class="btn btn-default filter-button" onclick="filter(' + text + ')">Frequently used</button> <a></a>';

            for (var i = 0; i < allCategories.length; i++) {
                var text = "'" + allCategories[i] + "'";
                htmlToAdd += '<button class="btn btn-default filter-button" onclick="filter(' + text + ')" >' + allCategories[i] + '</button> <a></a>';
            }
            document.getElementById("allFilters").innerHTML = htmlToAdd;

            var allCharts = data.result.allViz;

            htmlToAdd2 = '<br>';
            for (var i = 0; i < allCharts.length; i++) {
                htmlToAdd2 += '<div class="gallery_product col-lg-4 col-md-4 col-sm-4 col-xs-6 filter ' + allCharts[i].categoryFilter + '" onclick = "useChart(' + allCharts[i].idVizMarket + ')">';
                htmlToAdd2 += '<div class="card border-left-primary shadow h-100 py-2">';
                htmlToAdd2 += '<div class="card-body">';
                if (allCharts[i].star == true) {
                    htmlToAdd2 += '<div class="topright">  <img src="image/bestValue.png" width="100" height="100"></div>';
                }
                htmlToAdd2 += '<div class="row no-gutters align-items-center">';
                htmlToAdd2 += '<div class="col mr-2">';
                htmlToAdd2 += '<iframe frameBorder="0" id="frame'+i+'"></iframe>';
                htmlToAdd2 += '<hr class="sidebar-divider d-none d-md-block">';
                htmlToAdd2 += '<div class="h5 mb-0 font-weight-bold text-gray-800">' + allCharts[i].description + '</div>';
                htmlToAdd2 += '<span class="badge badge-primary">' + allCharts[i].category + '</span>';
                for (var v = 0; v < allCharts[i].tags.length; v++) {
                    htmlToAdd2 += '<span class="badge badge-primary">' + allCharts[i].tags[v] + '</span>';
                }
                htmlToAdd2 += '<br>'
                for (var v = 0; v < allCharts[i].tagsSecundary.length; v++) {
                    htmlToAdd2 += '<span class="badge badge-info">' + allCharts[i].tagsSecundary[v] + '</span>';
                }
                htmlToAdd2 += '<hr class="sidebar-divider d-none d-md-block">';
                htmlToAdd2 += '<a onclick = "likeviz(' + allCharts[i].idVizMarket + ')"> <b id="likes' + allCharts[i].idVizMarket + '">' + allCharts[i].likes + '</b>  <i class="fas fa-thumbs-up fa-2x text-gray-600"></i></a>';
                htmlToAdd2 += '<a><b>  ' + allCharts[i].used + '</b>  <i class="fas fa-check fa-2x text-gray-600"></i></a>';
                htmlToAdd2 += '<a style = "float: right;" onclick = "expandViz(' + i + ')"> <i class="fas fa-expand fa-2x text-gray-600"></i></a>';
                htmlToAdd2 += '</div></div></div></div></div></div>';
            }

            document.getElementById("chartimage").innerHTML = htmlToAdd2;
                // htmlToAdd2 += '<iframe frameBorder="0" srcdoc="' + allCharts[i].chart + '"></iframe>';
                for (var i = 0; i < allCharts.length; i++) {
                    document.getElementById('frame' + i).src = "data:text/html;charset=utf-8," + escape(allCharts[i].chart);

                }

        }
    });
}
initPage();