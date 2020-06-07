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
function arrayContainsArray(superset, subset) {
    if (0 === subset.length) {
        return false;
    }
    return subset.every(function (value) {
        return (superset.includes(value));
    });
}
function refreshChart(arrayTags, arrayPrimary, arraySecondary) {
    var likeMin = document.getElementById("likeMin").value;
    var likeMax = document.getElementById("likeMax").value;
    var timesMin = document.getElementById("timesMin").value;
    var timesMax = document.getElementById("timesMax").value;

    var reqJson = {
        "primaryTags": arrayPrimary,
        "secondaryTags": arraySecondary,
        "tags": arrayTags,
        "minLikes": likeMin,
        "maxLikes": likeMax,
        "minUsed": timesMin,
        "maxUsed": timesMax
    };

    $.ajax({
        type: "POST",
        contentType: 'application/json',
        url: "http://localhost:8080/market/getAllMarketFilter",
        data: JSON.stringify(reqJson),
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

function changeFilters() {
    var arrayTags = [];
    var tags = document.getElementsByName("tags[]");
    for (var i = 0; i < tags.length; i++) {
        if (tags[i].checked == true) {
            arrayTags.push(tags[i].value);
        }
    }

    var arrayPrimary = [];
    var primary = document.getElementsByName("primary[]");
    for (var i = 0; i < primary.length; i++) {
        if (primary[i].checked == true) {
            arrayPrimary.push(primary[i].value);
        }
    }

    var arraySecondary = [];
    var secondary = document.getElementsByName("secondary[]");
    for (var i = 0; i < secondary.length; i++) {
        if (secondary[i].checked == true) {
            arraySecondary.push(secondary[i].value);
        }
    }


    refreshChart(arrayTags, arrayPrimary, arraySecondary);

}
function initPage() {
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/market/getAllMarket",
        success: function (data) {
            document.getElementById("likeMin").value = data.result.minLike;
            document.getElementById("likeMax").value = data.result.maxLike;
            document.getElementById("timesMin").value = data.result.minUsed;
            document.getElementById("timesMax").value = data.result.maxUsed;

            var descriptions = data.result.description;
            var htmlChecked = '';
            for (var i = 0; i < descriptions.length; i++) {

                htmlChecked += '<div class="form-check">';
                htmlChecked += '<input type="checkbox" class="form-check-input" id="secundary' + i + '" name="secondary[]" value="' + descriptions[i] + '" onchange="changeFilters()">';
                htmlChecked += '<label class="form-check-label" for="secundary' + i + '">' + descriptions[i] + '</label></div>';
            }

            document.getElementById("secundaryTags").innerHTML = htmlChecked;


            var tags = data.result.tags;
            var numberTags = data.result.numberTags;
            var htmlTags = '';
            var size = 10;
            if (size > tags.length) {
                size = tags.length;
            }

            for (var i = 0; i < size; i++) {

                htmlTags += '<div class="form-check">';
                htmlTags += '<input type="checkbox" class="form-check-input" id="tags' + i + '" name="tags[]" value="' + tags[i] + '" onchange="changeFilters()">';
                htmlTags += '<label class="form-check-label" for="tags' + i + '">' + tags[i] + '</label>';
                htmlTags += ' <span class="badge badge-primary" style = "float: right;">' + numberTags[i] + '</span> ';
                htmlTags += ' </div>';
            }
            document.getElementById("tags").innerHTML = htmlTags;

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