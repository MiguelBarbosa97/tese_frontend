function handleSelectionScript(counter, value) {
    console.log(counter);
    console.log(value);
    if (value == 'url') {
        document.getElementById('file' + counter).type = 'hidden';
        document.getElementById('url' + counter).type = 'text';
    } else {
        document.getElementById('file' + counter).type = 'file';
        document.getElementById('url' + counter).type = 'hidden';
    }
}
function handleSelectionStyle(counter, value) {
    console.log(counter);
    console.log(value);
    if (value == 'url') {
        document.getElementById('fileStyle' + counter).type = 'hidden';
        document.getElementById('urlStyle' + counter).type = 'text';
    } else {
        document.getElementById('fileStyle' + counter).type = 'file';
        document.getElementById('urlStyle' + counter).type = 'hidden';
    }
}
function deleteLib(idLib){
    console.log(idLib);

    $.ajax({
        type: "DELETE",
        contentType: 'application/json',
        url: "http://localhost:8080/libs/deleteLibs/" +idLib,  
        success: function (data) {
            init_page();
        }
      });
}

function init_page() {
    function updateTable(tableId, jsonData) {
        var headersAv = ['Name', 'Version', 'Description', 'Number of files', 'Number of charts'];
        var tableHTML = "<tr>";
        console.log(headersAv);
        for (var i = 0; i < headersAv.length; i++) {
            tableHTML += "<th>" + headersAv[i] + "</th>";
        }
        tableHTML += "<th>Actions</th>";

        tableHTML += "</tr>";

        for (var eachItem in jsonData) {
            tableHTML += "<tr>";
            var dataObj = jsonData[eachItem];
            for (var eachValue in dataObj) {
                console.log(eachValue);
                if(eachValue !='idLib'){
                    tableHTML += "<td>" + dataObj[eachValue] + "</td>";
                }else{
                    if(dataObj.timesUsed == 0){
                        tableHTML +=  '<td> <a href="#" class="btn btn-danger btn-circle btn-sm" onclick="deleteLib('+dataObj[eachValue]+')"> <i class="fas fa-trash"></i></a> </td>';
                    }else{
                        tableHTML +=  '<td> <a href="#" class="btn btn-danger btn-circle btn-sm isDisabled" onclick="deleteLib('+dataObj[eachValue]+')"> <i class="fas fa-trash"></i></a> </td>';
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
            console.log(data.result);
            updateTable("library_table", data.result)
        }
    });
}

init_page();

$(document).ready(function () {
    var counter = 0;
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

        cols += '<td> <select id="typeScript' + counter + '" name = "typeScript' + counter + '" class="form-control"  onChange="handleSelectionScript(' + counter + ',value)"><option value="file" selected>File</option><option value="url">URL</option> </select></td>';
        cols += '<td><input type="file" id="file' + counter + '" name="file' + counter + '" class="form-control-file" /> <input type="hidden" id="url' + counter + '" name="url' + counter + '" class="form-control" /></td>';
        cols += '<td><input type="button" class="ibtnDel1 btn btn-md btn-danger " value="X"></td>';
        newRow.append(cols);
        $("table.order-list1").append(newRow);
        counter++;

    });

    $("table.order-list1").on("click", ".ibtnDel1", function (event) {
        $(this).closest("tr").remove();
        counter -= 1
    });
});