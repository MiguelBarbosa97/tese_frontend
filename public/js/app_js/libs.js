function handleSelectionScript(counter, value) {
  

    if (value == 'url') {
        document.getElementById('file' + counter).type = 'hidden';
        document.getElementById('url' + counter).type = 'text';
    } else {
        document.getElementById('file' + counter).type = 'file';
        document.getElementById('url' + counter).type = 'hidden';
    }
}
function handleSelectionStyle(counter, value) {
   
    if (value == 'url') {
        document.getElementById('fileStyle' + counter).type = 'hidden';
        document.getElementById('urlStyle' + counter).type = 'text';
    } else {
        document.getElementById('fileStyle' + counter).type = 'file';
        document.getElementById('urlStyle' + counter).type = 'hidden';
    }
}
function deleteLib(idLib) {

    $.ajax({
        type: "DELETE",
        contentType: 'application/json',
        url: "http://localhost:8080/libs/deleteLibs/" + idLib,
        success: function (data) {
            init_page();
        }
    });
}

function init_page() {
    function updateTable(tableId, jsonData) {
        var headersAv = ['Name', 'Version', 'Description', 'Number of files', 'Number of charts'];
        var tableHTML = "<tr>";

        for (var i = 0; i < headersAv.length; i++) {
            tableHTML += "<th>" + headersAv[i] + "</th>";
        }
        tableHTML += "<th>Actions</th>";

        tableHTML += "</tr>";

        for (var eachItem in jsonData) {
            tableHTML += "<tr>";
            var dataObj = jsonData[eachItem];
            for (var eachValue in dataObj) {
                if (eachValue != 'idLib') {
                    tableHTML += "<td>" + dataObj[eachValue] + "</td>";
                } else {
                    if (dataObj.timesUsed == 0) {
                        tableHTML += '<td> <a href="#" class="btn btn-danger btn-circle btn-sm" onclick="deleteLib(' + dataObj[eachValue] + ')"> <i class="fas fa-trash"></i></a> </td>';
                    } else {
                        tableHTML += '<td> <a href="#" class="btn btn-danger btn-circle btn-sm isDisabled"> <i class="fas fa-trash"></i></a> </td>';
                    }
                }
            }
            tableHTML += "</tr>";
        }

        document.getElementById(tableId).innerHTML = tableHTML;
    }

    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/libs/getLibs",
        success: function (data) {
            updateTable("library_table", data.result)
        }
    });
}

init_page();

$(document).ready(function () {
    var counter = 0;
    var counter1 = 0;

    $("#addrow").on("click", function () {
        var newRow = $("<tr>");
        var cols = "";

        cols += '<td> <select id="typeStyle' + counter + '" name = "typeStyle' + counter + '" class="form-control"  onChange="handleSelectionStyle(' + counter + ',value)"><option value="file" selected>File</option><option value="url">URL</option> </select></td>';
        cols += '<td><input type="file" id="fileStyle' + counter + '" name="fileStyle' + counter + '" class="form-control-file" /> <input type="hidden" id="urlStyle' + counter + '" name="urlStyle' + counter + '" class="form-control" /></td>';
        cols += '<td><input type="button" class="ibtnDel1 btn btn-md btn-danger " value="X"></td>';
        newRow.append(cols);
        $("table.order-list").append(newRow);
        counter++;

    });

    $("table.order-list").on("click", ".ibtnDel", function (event) {
        $(this).closest("tr").remove();
        counter -= 1
    });

    $("#addrow1").on("click", function () {
        var newRow = $("<tr>");
        var cols = "";

        cols += '<td> <select id="typeScript' + counter1 + '" name = "typeScript' + counter1 + '" class="form-control"  onChange="handleSelectionScript(' + counter1 + ',value)"><option value="file" selected>File</option><option value="url">URL</option> </select></td>';
        cols += '<td><input type="file" id="file' + counter1 + '" name="file' + counter1 + '" class="form-control-file" /> <input type="hidden" id="url' + counter1 + '" name="url' + counter1 + '" class="form-control" /></td>';
        cols += '<td><input type="button" class="ibtnDel1 btn btn-md btn-danger " value="X"></td>';
        newRow.append(cols);
        $("table.order-list1").append(newRow);
        counter1++;

    });

    $("table.order-list1").on("click", ".ibtnDel1", function (event) {
        $(this).closest("tr").remove();
        counter -= 1
    });

    $("#importLib").on("click", function () {
        var libDetails = [];

        // JAVASCRIPT
        var lengthScripts = document.getElementById("scriptsTable").tBodies[0].rows.length;

        for (var i = 0; i < lengthScripts; i++) {
            var typeSelec = document.getElementById("typeScript" + i).options[document.getElementById("typeScript" + i).selectedIndex].value;
            if (typeSelec == 'url') {
                var elem = {
                    "path": document.getElementById("url" + i).value,
                    "type": 1
                };
            } else {
                var formData = new FormData();
                formData.append('file', document.getElementById("file" + i).files[0]);
                $.ajax({
                    type: "POST",
                    contentType: false,
                    url: "http://localhost:9000/uploadLibJs",
                    data: formData,
                    processData: false,
                    async:false,
                    success: function (data) {
                        var elem = {
                            "path": "uploads/js/" + data.filename,
                            "type": 1
                        };
                        sessionStorage.setItem('temp', JSON.stringify(elem));
                    }
                });
                var elem = sessionStorage.getItem('temp');
                elem = JSON.parse(elem)

            }
            libDetails.push(elem);

        }

        //CSS
        var lengthScripts = document.getElementById("styleTable").tBodies[0].rows.length;

        for (var i = 0; i < lengthScripts; i++) {
            var typeSelec = document.getElementById("typeStyle" + i).options[document.getElementById("typeStyle" + i).selectedIndex].value;
            if (typeSelec == 'url') {
                var elem = {
                    "path": document.getElementById("urlStyle" + i).value,
                    "type": 0
                };
            } else {
                var formData = new FormData();
                formData.append('file', document.getElementById("fileStyle" + i).files[0]);
                $.ajax({
                    type: "POST",
                    contentType: false,
                    url: "http://localhost:9000/uploadLibCss",
                    data: formData,
                    processData: false,
                    async:false,
                    success: function (data) {
                        var elem = {
                            "path": "uploads/css/" + data.filename,
                            "type": 0
                        };
                        sessionStorage.setItem('temp', JSON.stringify(elem));
                    }
                });
                var elem = sessionStorage.getItem('temp');
                elem = JSON.parse(elem)
            }
            libDetails.push(elem);

        }

        var name = document.getElementById("name").value;
        var version = document.getElementById("version").value;
        var description = document.getElementById("description").value;

        var requestJson = {
            "name": name,
            "version": version,
            "description": description,
            "libDetails": libDetails
        }

        console.log(JSON.stringify(requestJson));

        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: "http://localhost:8080/libs/importLib",
            data: JSON.stringify(requestJson),
            success: function (data) {
      
              init_page();
              document.getElementById("name").value = '';
              document.getElementById("version").value = '';
              document.getElementById("description").value = '';
      
              Swal.fire({
                position: 'top-end',
                title: JSON.stringify(data.message).slice(1, -1),
                showConfirmButton: false,
                timer: 1000
              })
              $('#newLibModal').modal('hide');
      
            },
            error: function (error) {
              console.log(error);
              Swal.fire({
                position: 'top-end',
                title: JSON.stringify(error.message).slice(1, -1),
                showConfirmButton: false,
                timer: 1000
              })
            },
          });
    });
});