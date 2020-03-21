$(document).ready(function () {
    // const Swal = require('sweetalert2')
    // import Swal from 'sweetalert2'

    function updateTable(tableId, jsonData){

        var tableHTML = "<tr>";
        for (var headers in jsonData[0]) {
          tableHTML += "<th>" + headers + "</th>";
        }
        tableHTML += "</tr>";
      
        for (var eachItem in jsonData) {
          tableHTML += "<tr>";
          var dataObj = jsonData[eachItem];
          for (var eachValue in dataObj){
            tableHTML += "<td>" + dataObj[eachValue] + "</td>";
          }
          tableHTML += "</tr>";
        }
      
        document.getElementById(tableId).innerHTML = tableHTML;
      }

    var user_id = sessionStorage.getItem('user_id');

    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/users/getAllConnections/" + user_id,
        success: function (data) {
            
            $("#csv_count").text(''+ data.result.countCSV);
            $("#rest_count").text(''+ data.result.countRest);
            $("#hive_count").text(''+ data.result.countHive);

            updateTable("connection_table", data.result.connections )
        }
    });

});