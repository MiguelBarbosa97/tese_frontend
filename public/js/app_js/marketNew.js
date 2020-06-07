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

function nextPage(id) {

    window.location.href = "/marketDetail?id=" + id;

}

function initPage() {
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/market/getAllMarket",
        success: function (data) {

            var allCharts = data.result.allViz;
            var count = 0;
            var htmlToAdd2 = '<div class="row">';
            for (var i = 0; i < allCharts.length; i++) {
                count++;

                htmlToAdd2 += '<div class="col-xl-4 col-md-6 mb-4">';
                htmlToAdd2 += '<div class="card shadow h-100 py-2">';
                htmlToAdd2 += '<div class="card-body" onclick = "nextPage(' + allCharts[i].idVizMarket + ')">';
                if (allCharts[i].star == true) {
                    htmlToAdd2 += '<div class="topright">  <img src="image/bestValue.png" width="100" height="100"></div>';
                }

                htmlToAdd2 += '<iframe frameBorder="0" id="frame' + i + '" width="100%" height="50%" ></iframe>';
                htmlToAdd2 += '<a id="hid' + i + '" hidden>aaa</a>'
                htmlToAdd2 += '<hr class="sidebar-divider d-none d-md-block">';
                htmlToAdd2 += '<div class="h5 mb-0 font-weight-bold text-gray-800">' + allCharts[i].description + '</div>';
                htmlToAdd2 += '<span class="badge badge-primary">' + allCharts[i].category + '</span> ';
                for (var v = 0; v < allCharts[i].tags.length; v++) {
                    htmlToAdd2 += '<span class="badge badge-primary">' + allCharts[i].tags[v] + '</span> ';
                }
                htmlToAdd2 += '<br>'
                for (var v = 0; v < allCharts[i].tagsSecundary.length; v++) {
                    htmlToAdd2 += '<span class="badge badge-secondary">' + allCharts[i].tagsSecundary[v] + '</span> ';
                }
                htmlToAdd2 += '<hr class="sidebar-divider d-none d-md-block">';
                htmlToAdd2 += '<div class="row">';
                htmlToAdd2 += '<div class="col">';

                htmlToAdd2 += '<i class="far fa-thumbs-up text-primary" aria-hidden="true" onclick = "likeviz(' + allCharts[i].idVizMarket + ')"></i> ';
                htmlToAdd2 += '<p class= "p_class" onclick = "likeviz(' + allCharts[i].idVizMarket + ')"> <b id="likes' + allCharts[i].idVizMarket + '">' + allCharts[i].likes + '</b> likes</p>';
                htmlToAdd2 += '<br>';
                htmlToAdd2 += '<i class="far fa-check-square text-primary" aria-hidden="true"></i> ';
                htmlToAdd2 += '<p class= "p_class"> <b>' + allCharts[i].used + '</b> times used</p>';

                htmlToAdd2 += '</div><div class="col">';
                var str = allCharts[i].username;
                var matches = str.match(/\b(\w)/g); // ['J','S','O','N']
                var acronym = matches.join(''); // JSON
                htmlToAdd2 += '<a style = "float: right;" class="btn btn-secondary btn-circle" data-toggle="tooltip" title="' + allCharts[i].username + '">' + acronym + '</a>';
                htmlToAdd2 += '</div></div>';

                htmlToAdd2 += '</div></div></div>';

                if (count == 3) {
                    htmlToAdd2 += '</div>';
                    htmlToAdd2 += '<div class="row">';
                    count = 0;

                }
            }
            htmlToAdd2 += '</div>';

            document.getElementById("chartimage").innerHTML = htmlToAdd2;
            for (var i = 0; i < allCharts.length; i++) {
                document.getElementById('frame' + i).src = "data:text/html;charset=utf-8," + escape(allCharts[i].chart);

            }

        }
    });
}
initPage();