$(document).ready(function () {
  // const Swal = require('sweetalert2')
  // import Swal from 'sweetalert2'


  function init_page() {
    function updateTable(tableId, jsonData) {

      var tableHTML = "<tr>";
      for (var headers in jsonData[0]) {
        tableHTML += "<th>" + headers + "</th>";
      }
      tableHTML += "</tr>";

      for (var eachItem in jsonData) {
        tableHTML += "<tr>";
        var dataObj = jsonData[eachItem];
        for (var eachValue in dataObj) {
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

        $("#csv_count").text('' + data.result.countCSV);
        $("#rest_count").text('' + data.result.countRest);
        $("#hive_count").text('' + data.result.countHive);

        updateTable("connection_table", data.result.connections)
      }
    });
  }

  init_page();
  $("#save_hive").click(function () {

    var user_id = sessionStorage.getItem('user_id');

    var data_service = {
      "endpoint": document.getElementById("hive_url").value,
      "port": document.getElementById("hive_port").value,
      "database": document.getElementById("hive_database").value,
      "username": document.getElementById("hive_user").value,
      "password": document.getElementById("hive_password").value,
      "userid": user_id
    };
    $.ajax({
      type: "POST",
      contentType: 'application/json',
      url: "http://localhost:8080/hive/save",
      data: JSON.stringify(data_service),
      success: function (data) {

        init_page();
        document.getElementById("hive_url").value = '';
        document.getElementById("hive_port").value = '';
        document.getElementById("hive_database").value = '';
        document.getElementById("hive_user").value = '';
        document.getElementById("hive_password").value = '';

        Swal.fire({
          position: 'top-end',
          title: JSON.stringify(data.message).slice(1, -1),
          showConfirmButton: false,
          timer: 1000
        })
        $('#hiveModal').modal('hide');

      },
      error: function (error) {
        console.log(error);
        Swal.fire({
          position: 'top-end',
          title: JSON.stringify(data.message).slice(1, -1),
          showConfirmButton: false,
          timer: 1000
        })
      },
    });

  });

  $("#test_connection_hive").click(function () {

    var user_id = sessionStorage.getItem('user_id');

    var data_service = {
      "endpoint": document.getElementById("hive_url").value,
      "port": document.getElementById("hive_port").value,
      "database": document.getElementById("hive_database").value,
      "username": document.getElementById("hive_user").value,
      "password": document.getElementById("hive_password").value,
      "userid": user_id
    };
    $.ajax({
      type: "POST",
      contentType: 'application/json',
      url: "http://localhost:8080/hive/testConnection",
      data: JSON.stringify(data_service),
      success: function (data) {

        Swal.fire({
          position: 'top-end',
          title: JSON.stringify(data.message).slice(1, -1),
          showConfirmButton: false,
          timer: 1000
        })


      },
      error: function (error) {
        console.log(error);
        Swal.fire({
          position: 'top-end',
          title: JSON.stringify(data.message).slice(1, -1),
          showConfirmButton: false,
          timer: 1000
        })
      },
    });

  });

  $("#test_connection_rest").click(function () {

    var data_service = {

      "url": document.getElementById("rest_url").value,
      "method": document.getElementById("rest_method").value,
      "acceptText": "application/json",
      "restUsername": document.getElementById("rest_username").value,
      "restPassword": document.getElementById("rest_password").value,
      "authMethod": document.getElementById("auth").value
    };

    alert(JSON.stringify(data_service));

    $.ajax({
      type: "POST",
      contentType: 'application/json',
      url: "http://localhost:8080/RestClient/testConnection",
      data: JSON.stringify(data_service),
      success: function (data) {

        Swal.fire({
          position: 'top-end',
          title: JSON.stringify(data.message).slice(1, -1),
          showConfirmButton: false,
          timer: 1000
        })


      },
      error: function (error) {
        console.log(error);
        Swal.fire({
          position: 'top-end',
          title: JSON.stringify(data.message).slice(1, -1),
          showConfirmButton: false,
          timer: 1000
        })
      },
    });

  });

 $("#save_rest").click(function () {

    var user_id = sessionStorage.getItem('user_id');

    var data_service = {

      "url": document.getElementById("rest_url").value,
      "method": document.getElementById("rest_method").value,
      "acceptText": "application/json",
      "name":document.getElementById("rest_name").value,
      "userid": user_id,
      "restUsername": document.getElementById("rest_username").value,
      "restPassword": document.getElementById("rest_password").value,
    };
    $.ajax({
      type: "POST",
      contentType: 'application/json',
      url: "http://localhost:8080/RestClient/SaveConnection",
      data: JSON.stringify(data_service),
      success: function (data) {

        init_page();
        document.getElementById("rest_url").value = '';
        document.getElementById("rest_name").value = '';
        document.getElementById("rest_username").value = '';
        document.getElementById("rest_password").value = '';

        Swal.fire({
          position: 'top-end',
          title: JSON.stringify(data.message).slice(1, -1),
          showConfirmButton: false,
          timer: 1000
        })
        $('#restModal').modal('hide');

      },
      error: function (error) {
        console.log(error);
        Swal.fire({
          position: 'top-end',
          title: JSON.stringify(data.message).slice(1, -1),
          showConfirmButton: false,
          timer: 1000
        })
      },
    });

    

  });


  $("#save_csv").click(function () {

    var user_id = sessionStorage.getItem('user_id');

    var formData = new FormData();

    formData.append('file', $('input[type=file]')[0].files[0]);

    alert("CSV");
    console.log(formData);
    $.ajax({
      type: "POST",
      contentType: false,
      url: "http://localhost:8080/csv/add/"+user_id,
      data: formData,
      processData: false,
      success: function (data) {

        init_page();

        Swal.fire({
          position: 'top-end',
          title: JSON.stringify(data.message).slice(1, -1),
          showConfirmButton: false,
          timer: 1000
        })
        $('#csvModal').modal('hide');

      },
      error: function (error) {
        console.log(error);
        Swal.fire({
          position: 'top-end',
          title: JSON.stringify(data.message).slice(1, -1),
          showConfirmButton: false,
          timer: 1000
        })
      },
    });

    

  });


});