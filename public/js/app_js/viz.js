var user_id = sessionStorage.getItem('user_id');

var editorhtml = CodeMirror.fromTextArea(document.getElementById('htmltextarea'), {
    mode: "xml",
    theme: "dracula",
    lineNumbers: true,
    autoCloseTags: true
});
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

function selectTheme() {
    var e = document.getElementById("selectTheme");
    var strUser = e.options[e.selectedIndex].value;
    editorhtml.setOption("theme", strUser);
    editorcss.setOption("theme", strUser);
    editorjs.setOption("theme", strUser);

}

$(document).ready(function () {
    var viz_id = sessionStorage.getItem('viz_id');

    document.getElementById("nameViz").addEventListener("input", function () {
        var value = document.getElementById("nameViz").innerHTML;

        $.ajax({
            type: "GET",
            contentType: 'application/json',
            url: "http://localhost:8080/viz/updateNameViz/" + value + "/" + viz_id,
            success: function (data) {
            }
        });
    }, false);

    editorhtml.on('change', function () {
        // get value right from instance
        updateVizData(viz_id);
    });

    editorcss.on('change', function () {
        // get value right from instance
        updateVizData(viz_id);

    });

    editorjs.on('change', function () {
        var t0 = performance.now()
        // get value right from instance
        updateVizData(viz_id);
        var t1 = performance.now()
        console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")

    });

    getVizData(viz_id, true);
    getLibs(viz_id);
    getLoad(viz_id, user_id);

    function updateVizData(viz_id) {
        var reqJson = {
            "css": editorcss.getValue(),
            "js": editorjs.getValue(),
            "html": editorhtml.getValue()
        }
        var start_time = new Date().getTime();
        console.log("http://localhost:8080/viz/updateViz/" + viz_id + "/" + user_id);

        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: "http://localhost:8080/viz/updateViz/" + viz_id + "/" + user_id,
            data: JSON.stringify(reqJson),
            success: function (data) {
                var request_time = new Date().getTime() - start_time;
                console.log("SIZE: ", data.result.all.length);
                console.log("Time: ", request_time);
                document.getElementById('result').src = "data:text/html;charset=utf-8," + escape(data.result.all);
            }
        });
    }

    function getVizData(viz_id, all) {
        $.ajax({
            type: "GET",
            contentType: 'application/json',
            url: "http://localhost:8080/viz/getViz/" + viz_id + "/" + user_id,
            success: function (data) {

                document.getElementById("nameViz").innerHTML = data.result.name;

                if (all == true) {
                    editorhtml.getDoc().setValue(data.result.html);
                    editorcss.getDoc().setValue(data.result.css);
                    editorjs.getDoc().setValue(data.result.js);
                }

                document.getElementById('result').src = "data:text/html;charset=utf-8," + escape(data.result.all);
            }
        });
    }

    function getLibs(viz_id) {

        $.ajax({
            type: "GET",
            contentType: 'application/json',
            url: "http://localhost:8080/libs/getLibs/" + viz_id,
            success: function (data) {

                document.getElementById('result').src = "data:text/html;charset=utf-8," + escape(data.result.all);

                var htmlAdd = '';
                for (var i = 0; i < data.result.length; i++) {
                    var check = '';
                    if (data.result[i].used == true) {
                        check = 'checked';
                    }

                    htmlAdd += '<tr> <td> <div class="custom-control custom-checkbox">';
                    htmlAdd += '<input type="checkbox" class="custom-control-input" name="libsIds[]" id="customCheck' + i + '" value="' + data.result[i].idLib + '" ' + check + '>';
                    htmlAdd += '<label class="custom-control-label" for="customCheck' + i + '"></label></div></td>';
                    htmlAdd += '<td>' + data.result[i].name + '</td>';
                    htmlAdd += '<td>' + data.result[i].version + '</td></tr>';

                }
                document.getElementById("tableLib").innerHTML = htmlAdd;
            }
        });
    }

    function getLoad(viz_id, user_id) {
        $.ajax({
            type: "GET",
            contentType: 'application/json',
            url: "http://localhost:8080/viz/getQueries/" + viz_id + "/" + user_id,
            success: function (data) {
                var htmlAdd = '';
                for (var i = 0; i < data.result.length; i++) {
                    var check = '';
                    if (data.result[i].used == true) {
                        check = 'checked';
                    }
                    htmlAdd += '<tr> <td> <div class="custom-control custom-checkbox">';
                    htmlAdd += '<input type="radio" class="custom-control-input" name="queryIds[]" id="loadcheck' + i +
                        '" value="' + data.result[i].idQuery + "&" + data.result[i].type + '" ' + check + '>';
                    htmlAdd += '<label class="custom-control-label" for="loadcheck' + i + '"></label></div></td>';
                    htmlAdd += '<td>' + data.result[i].type + '</td>';
                    htmlAdd += '<td>' + data.result[i].name + '</td></tr>';

                }

                document.getElementById("tableLoad").innerHTML = htmlAdd;
            }
        });
    }

    $("#import_lib").click(function () {

        var allChecks = document.getElementsByName('libsIds[]');

        var libsIds = [];
        for (var i = 0; i < allChecks.length; i++) {
            if (allChecks[i].checked == true) {
                libsIds.push(parseInt(allChecks[i].value));
            }
        }
        reqJson = {
            "idLibs": libsIds
        };

        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: "http://localhost:8080/libs/setLibs/" + viz_id,
            data: JSON.stringify(reqJson),
            success: function (data) {
                getVizData(viz_id, false);
                Swal.fire({
                    position: 'top-end',
                    title: "Imported",
                    showConfirmButton: false,
                    timer: 1000
                })
                $('#libModal').modal('hide');


            }
        });

    });


    $("#import_load").click(function () {
        var allChecks = document.getElementsByName('queryIds[]');
        var libsIds;
        for (var i = 0; i < allChecks.length; i++) {
            if (allChecks[i].checked == true) {

                libsIds = allChecks[i].value;
            }
        }
        var fields = libsIds.split('&');

        var id = fields[0];
        var type = fields[1];

        var req = {
            "queryId":  id,
            "queryType": type,
            "userId": user_id,
            "vizId":viz_id
        };
        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: "http://localhost:8080/viz/updateQuery",
            data: JSON.stringify(req),
            success: function (data) {
                getVizData(viz_id, false);

                Swal.fire({
                    position: 'top-end',
                    title: "Imported",
                    showConfirmButton: false,
                    timer: 1000
                })
                $('#loadModal').modal('hide');
            }
        });
        console.log(req);

    });
});

