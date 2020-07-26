var idUser = sessionStorage.getItem('user_id');
var idDash = sessionStorage.getItem('id_dashboard');;

var editorcss = CodeMirror.fromTextArea(document.getElementById('csstextarea'), {
    mode: "css",
    theme: "dracula",
    lineNumbers: true,
    autoCloseTags: true
});
var editorjs = CodeMirror.fromTextArea(document.getElementById('jstextarea'), {
    mode: "javascript",
    theme: "dracula",
    lineNumbers: true,
    autoCloseTags: true
});

function updateCss(payload) {
    $.ajax({
        type: "POST",
        contentType: 'application/json',
        url: "http://localhost:8080/dashboard/updateCss",
        data: JSON.stringify(payload),
        success: function (data) {
            editorcss.getDoc().setValue(data.result.css);
            editorjs.getDoc().setValue(data.result.js);
        }
    });
}


$(document).ready(function () {
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/dashboard/get/" + idDash + "/" + idUser,
        success: function (data) {
            editorcss.getDoc().setValue(data.result.css);
            editorjs.getDoc().setValue(data.result.js);

            document.getElementById("result").innerHTML = data.result.html;
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = data.result.css;

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
            for (var i = 0; i < data.result.libsJs.length; i++) {
                var element = data.result.libsJs[i];
                var s = document.createElement('script');
                s.src = element;
                document.body.appendChild(s);

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

});
