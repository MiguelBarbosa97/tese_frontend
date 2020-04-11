let curOpen;
document.getElementById("UIView").style.display = "block";
document.getElementById("SQLView").style.display = "none";
document.getElementById("wizardHide").style.display = "none";
document.getElementById("hiveTableHide").style.display = "none";

function fill_connection_dropdown(in_type) {

  var user_id = sessionStorage.getItem('user_id');

  var select = document.getElementById("connection");
  var length = select.options.length;

  for (i = length - 1; i >= 0; i--) {
    select.options[i] = null;
  }

  $.ajax({
    type: "GET",
    contentType: 'application/json',
    url: "http://localhost:8080/users/getAllConnections/" + in_type + "/" + user_id,
    success: function (data) {

      var new_array = data.result.connections;
      console.log(JSON.stringify(new_array))

      for (var i = 0; i < new_array.length; i++) {
        var option = document.createElement('option');
        option.text = new_array[i].id + " | " + new_array[i].name;
        option.value = new_array[i].id
        select.add(option, 0);
      }
    }
  });
}

function fill_table_dropdown(id) {

  var select = document.getElementById("hiveTableName");
  var length = select.options.length;

  for (i = length - 1; i >= 0; i--) {
    select.options[i] = null;
  }

  $.ajax({
    type: "GET",
    contentType: 'application/json',
    url: "http://localhost:8080/hive/getTables/" + id,
    success: function (data) {

      var new_array = data.result;
      if (new_array.length > 0) {
        for (var i = 0; i < new_array.length; i++) {
          var option = document.createElement('option');
          console.log(new_array[i].tab_name);
          option.text = new_array[i].tab_name;
          option.value = new_array[i].tab_name;

          select.add(option, 0);
        }
      }

    }
  });
}

$(document).ready(function () {

  curOpen = $('.step')[0];

  $('.next-btn').on('click', function () {
    let cur = $(this).closest('.step');
    let next = $(cur).next();
    $(cur).addClass('minimized');
    setTimeout(function () {
      $(next).removeClass('minimized');
      curOpen = $(next);
    }, 400);
  });

  $('.close-btn').on('click', function () {
    let cur = $(this).closest('.step');
    $(cur).addClass('minimized');
    curOpen = null;
  });

  $('.step .step-content').on('click', function (e) {
    e.stopPropagation();
  });

  $('.step').on('click', function () {
    if (!$(this).hasClass("minimized")) {
      curOpen = null;
      $(this).addClass('minimized');
    }
    else {
      let next = $(this);
      if (curOpen === null) {
        curOpen = next;
        $(curOpen).removeClass('minimized');
      }
      else {
        $(curOpen).addClass('minimized');
        setTimeout(function () {
          $(next).removeClass('minimized');
          curOpen = $(next);
        }, 300);
      }
    }
  });

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
      url: "http://localhost:8080/users/getAllQueries/" + user_id,
      success: function (data) {

        $("#csv_count").text('' + data.result.countCSV);
        $("#rest_count").text('' + data.result.countRest);
        $("#hive_count").text('' + data.result.countHive);

        updateTable("query_table", data.result.query)
      }
    });
  }


  init_page();

});