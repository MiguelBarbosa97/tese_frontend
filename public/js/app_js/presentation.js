var guid = location.search.split('id=')[1];
guid = guid.split('&')[0];
var type = location.search.split('type=')[1];
var idUser = sessionStorage.getItem('user_id');

if (idUser == undefined) {
    idUser = 0;
}
function updateCss(payload) {
    $.ajax({
        type: "POST",
        contentType: 'application/json',
        url: "http://localhost:8080/dashboard/updateCss",
        data: JSON.stringify(payload),
        success: function (data) {
                 
        }
    });
}

function charts(idDash, idUser) {
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/dashboard/get/" + idDash + "/" + idUser,
        success: function (data) {
            document.getElementById("result").innerHTML = data.result.html;
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = data.result.css;
            for (var i = 0; i < data.result.libsJs.length; i++) {
                var element = data.result.libsJs[i];
                var s = document.createElement('script');
                s.src = element;
                document.body.appendChild(s);

            }
            for (var i = 0; i < data.result.libsCss.length; i++) {
                var element = data.result.libsCss[i];
                var styleLib = document.createElement('style');
                styleLib.type = 'text/css';
                styleLib.innerHTML = element;
                document.getElementsByTagName('head')[0].appendChild(styleLib);
            }

            if (data.result.libsJs.length != 0) {
                s.addEventListener("load", () => {
                    console.log("Script added successfully");
                    var script = document.createElement('script');
                    script.innerHTML = data.result.js;
                    document.body.appendChild(script);
                });
            } else {
                var script = document.createElement('script');
                script.innerHTML = data.result.js;
                document.body.appendChild(script);
            }

            document.getElementsByTagName('head')[0].appendChild(style);

            $(function () {
                $('.draggable').draggable({
                    containment: 'parent',
                    start: function (event, ui) {
                        $(this).css('background-color', '#EEEEEE');
                    },
                    stop: function (event, ui) {
                        var id = $(this).attr('id');
                        var fields = id.split('_');
                        var jsonElement = {
                            idViz: fields[1],
                            left: ui.position.left,
                            top: ui.position.top,
                            idDash: idDash,
                            idUser: idUser
                        };
                        console.log(JSON.stringify(jsonElement));
                        updateCss(jsonElement);
                        $(this).css("background-color", "");
                    }
                });
                $('.draggable').resizable({
                    handles: "n,s,w,e",
                    start: function (event, ui) {
                        $(this).css('background-color', '#EEEEEE');
                    },
                    stop: function (event, ui) {
                        var id = $(this).attr('id');
                        var fields = id.split('_');

                        var jsonElement = {
                            idViz: fields[1],
                            width: ui.size.width,
                            height: ui.size.height,
                            idDash: idDash,
                            idUser: idUser
                        };
                        console.log(JSON.stringify(jsonElement));
                        updateCss(jsonElement);

                        $(this).css("background-color", "");

                    }
                });
            });
        }
    });
}

function chartsView(idDash, idUser) {
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/dashboard/get/" + idDash + "/" + idUser,
        success: function (data) {
            document.getElementById("result").innerHTML = data.result.html;
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = data.result.css;
            for (var i = 0; i < data.result.libsJs.length; i++) {
                var element = data.result.libsJs[i];
                var s = document.createElement('script');
                s.src = element;
                document.body.appendChild(s);

            }
            for (var i = 0; i < data.result.libsCss.length; i++) {
                var element = data.result.libsCss[i];
                var styleLib = document.createElement('style');
                styleLib.type = 'text/css';
                styleLib.innerHTML = element;
                document.getElementsByTagName('head')[0].appendChild(styleLib);
            }

            if (data.result.libsJs.length != 0) {
                s.addEventListener("load", () => {
                    console.log("Script added successfully");
                    var script = document.createElement('script');
                    script.innerHTML = data.result.js;
                    document.body.appendChild(script);
                });
            } else {
                var script = document.createElement('script');
                script.innerHTML = data.result.js;
                document.body.appendChild(script);
            }

            document.getElementsByTagName('head')[0].appendChild(style);

            $(function () {
                $('.draggable').draggable().resizable();
            });
        }
    });
}

$.ajax({
    type: "GET",
    contentType: 'application/json',
    url: "http://localhost:8080/dashboard/checkPresentation/" + idUser + "/" + guid,
    success: function (data) {
        console.log("sss");
        var htmlError = '';

        if (data.message == "200") {
            if(type == "0"){
                charts(data.result[1], data.result[0]);
            }else{
                chartsView(data.result[1], data.result[0]);
            }
        } else if (data.message == "401") {
            htmlError += '<div class="text-center">';
            htmlError += '<div class="error mx-auto" data-text="401">401</div>';
            htmlError += '<p class="lead text-gray-800 mb-5">Not Authorized</p>';
            htmlError += '<p class="text-gray-500 mb-0">Please contact the owner to provide you access...</p></div>';

            console.log("Not authorized");
        } else {

            htmlError += '<div class="text-center">';
            htmlError += '<div class="error mx-auto" data-text="404">404</div>';
            htmlError += '<p class="lead text-gray-800 mb-5">Page Not Found</p>';
            htmlError += '<p class="text-gray-500 mb-0">It looks like you found a glitch in the matrix...</p></div>';

            console.log("not found");
        }
        document.getElementById("contentError").innerHTML = htmlError;


    }
});
