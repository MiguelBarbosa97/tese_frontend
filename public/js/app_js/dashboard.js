var idUser = sessionStorage.getItem('user_id');
var idDash = 3;

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
        url: "http://localhost:8080/dashboard/get/3/11",
        success: function (data) {

            document.getElementById("result").innerHTML = data.result.html;
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = data.result.css;
            editorcss.getDoc().setValue(data.result.css);
            editorjs.getDoc().setValue(data.result.js);
            document.head.innerHTML += data.result.libsCss;
            document.body.innerHTML += data.result.libsJs;
            document.body.innerHTML += data.result.js;

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
