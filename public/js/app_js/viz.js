$(document).ready(function () {

    var viz_id = sessionStorage.getItem('viz_id');

    var editorhtml = CodeMirror.fromTextArea(document.getElementById('htmltextarea'), {
        mode: "xml",
        theme: "dracula",
        lineNumbers: true,
        autoCloseTags: true
    });
    editorhtml.on('change', function () {
        // get value right from instance
        console.log("html mudou");
        updateVizData(viz_id);
    });

    var editorcss = CodeMirror.fromTextArea(document.getElementById('csstextarea'), {
        mode: "css",
        theme: "dracula",
        lineNumbers: true,
        autoCloseTags: true
    });
    editorcss.on('change', function () {
        // get value right from instance
        console.log("css mudou");
        updateVizData(viz_id);

    });
    var editorjs = CodeMirror.fromTextArea(document.getElementById('jstextarea'), {
        mode: "javascript",
        theme: "dracula",
        lineNumbers: true,
        autoCloseTags: true
    });
    editorjs.on('change', function () {
        // get value right from instance
        console.log("js mudou");

        updateVizData(viz_id);

    });
    getVizData(viz_id, true);

    function updateVizData(viz_id){
        var reqJson = {
            "css":editorcss.getValue(),
            "js":editorjs.getValue(),
            "html":editorhtml.getValue()
        }
        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: "http://localhost:8080/viz/updateViz/" + viz_id,
            data: JSON.stringify(reqJson),
            success: function (data) {
                console.log(data.result.all);
                document.getElementById('result').src = "data:text/html;charset=utf-8," + escape(data.result.all);
            }
        });
    }

    function getVizData(viz_id, all){
        $.ajax({
            type: "GET",
            contentType: 'application/json',
            url: "http://localhost:8080/viz/getViz/" + viz_id,
            success: function (data) {
                
                if(all == true){
                    editorhtml.getDoc().setValue(data.result.html);
                    editorcss.getDoc().setValue(data.result.css);
                    editorjs.getDoc().setValue(data.result.js);
                }
                document.getElementById('result').src = "data:text/html;charset=utf-8," + escape(data.result.all);
            }
        });
    }
    
});