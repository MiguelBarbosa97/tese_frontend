let curOpen;
document.getElementById("UIView").style.display = "block";
document.getElementById("SQLView").style.display = "none";
document.getElementById("wizardHide").style.display = "none";
document.getElementById("hiveTableHide").style.display = "none";


var editorsql = CodeMirror.fromTextArea(document.getElementById('sqlarea'), {
  mode: "sql",
  theme: "3024-day",
});
function updateTable(tableId, jsonData) {

  var tableHTML = "<tr>";
  for (var headers in jsonData[0]) {
    tableHTML += "<th>" + headers + "</th>";
  }
  tableHTML += "<th>Actions</th>";

  tableHTML += "</tr>";

  for (var eachItem in jsonData) {
    tableHTML += "<tr>";
    var dataObj = jsonData[eachItem];
    for (var eachValue in dataObj) {
      tableHTML += "<td>" + dataObj[eachValue] + "</td>";
    }
    tableHTML +=  '<td> <a href="#" class="btn btn-danger btn-circle btn-sm" onclick="deleteQuery('+dataObj.idQuery+',\''+dataObj.type+'\')"> <i class="fas fa-trash"></i></a> <a></a>  <a href="#" class="btn btn-info btn-circle btn-sm" onclick="shareQuery('+dataObj.idQuery+',\''+dataObj.type+'\')"> <i class="fas fa-share-alt"></i></a><a></a>  <a href="#" class="btn btn-warning btn-circle btn-sm" onclick="previewQuery('+dataObj.idQuery+',\''+dataObj.type+'\')"> <i class="far fa-eye"></i></a></td>';

    tableHTML += "</tr>";
  }

  document.getElementById(tableId).innerHTML = tableHTML;
}
function updateTablepreview(tableId, jsonData) {

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



function init_page() {

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

function deleteQuery(id, type){

$.ajax({
    type: "DELETE",
    contentType: 'application/json',
    url: "http://localhost:8080/users/deleteQueries/" + type + "/" + id,
    success: function (data) {
      init_page();
    },
  });
}

function previewQuery(id, type){
  $.ajax({
    type: "GET",
    contentType: 'application/json',
    url: "http://localhost:8080/users/preview/" + type + "/" + id,
    success: function (data) {
      $("#preview").modal();
      var text = '{ "data":[' + data.result + ']}';
      var json = JSON.parse(text);
      
      updateTablepreview("previewtable", json.data);
    },
  });

}

function shareQuery(id, type) {
  var user_id = sessionStorage.getItem('user_id');

  var url = '';
  if (type == 'Hive') {
    url = '/hive/shareQuery';

  } else if (type == 'rest') {
    url = '/RestClient/shareQuery';
  } else if (type == 'csv') {
    url = '/csv/shareQuery';
  }

  document.getElementById("pathShare").value = url;
  document.getElementById("connectionIdShare").value = id;

  var select = document.getElementById("allUsers");
  var length = select.options.length;
  for (i = length - 1; i >= 0; i--) {
    select.options[i] = null;
  }
  $.ajax({
    type: "GET",
    contentType: 'application/json',
    url: "  http://localhost:8080/users/getUsersToShare/" + user_id,
    success: function (data) {
      var new_array = data.result;
      if (new_array.length > 0) {
        for (var i = 0; i < new_array.length; i++) {
          var option = document.createElement('option');
          option.text = new_array[i].name;
          option.value = new_array[i].iduser;
          select.add(option, 0);
        }
      }
    }
  });
  $("#shareModal").modal();
}


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
  var option = document.createElement('option');
  option.text = option.value = "";
  select.add(option, 0);
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
          option.value = id + "/" + new_array[i].tab_name;

          select.add(option, 0);
        }
      }

    }
  });
  var option = document.createElement('option');
  option.text = option.value = "";
  select.add(option, 0);
}

function clear_columns(){
  var select = document.getElementById("selectedColumns");

  var length = select.options.length;

  for (i = length - 1; i >= 0; i--) {
    select.options[i] = null;
  }
  var bodyRef = document.getElementById('myTable').getElementsByTagName('tbody')[0]; 
  bodyRef.innerHTML = '';
}

function fill_column_dropdown_hive(value) {

  var select = document.getElementById("selectedColumns");

  var length = select.options.length;

  for (i = length - 1; i >= 0; i--) {
    select.options[i] = null;
  }

  $.ajax({
    type: "GET",
    contentType: 'application/json',
    url: "http://localhost:8080/hive/getColumn/" + value,
    success: function (data) {

      var new_array = data.result;
      if (new_array.length > 0) {
        for (var i = 0; i < new_array.length; i++) {
          var option = document.createElement('option');
          option.text = option.value = new_array[i].col_name;
          select.add(option, 0);
        }
    
        
      }

    }
  });

}

function fill_column_dropdown(value) {

  var select = document.getElementById("selectedColumns");
  
  var length = select.options.length;

  for (i = length - 1; i >= 0; i--) {
    select.options[i] = null;
  }

  $.ajax({
    type: "GET",
    contentType: 'application/json',
    url: "http://localhost:8080/" + value,
    success: function (data) {

      var new_array = data.result;
      if (new_array.length > 0) {
        for (var i = 0; i < new_array.length; i++) {
          var option = document.createElement('option');

          option.text = option.value = new_array[i];
          select.add(option, 0);
          // columns_filter.add(option, 0);
        }
  
      }

    }
  });



}

function fill_columns_for_filter(value) {

  var select = document.getElementById(value);

  var length = document.getElementById("selectedColumns").options.length;

  for (i = length - 1; i >= 0; i--) {
    var value = document.getElementById("selectedColumns").options[i].value;
    var option = document.createElement('option');

    option.text = option.value = value;
    select.add(option, 0);
  }

}

$(document).ready(function () {
  var counter = 0;
  $("#addrow").on("click", function () {
    var newRow = $("<tr>");
    var cols = "";
    var id_col = 'columns_filter' + counter;
    cols += '<td> <select id="columns_filter' + counter + '" name = "columns_filter' + counter + '" class="form-control"> </select></td>';
    cols += '<td><input type="text" id="value_filter' + counter + '" name="value_filter' + counter + '" class="form-control" /></td>';
    cols += '<td><input type="button" class="ibtnDel btn btn-md btn-danger " value="X"></td>';
    newRow.append(cols);
    $("table.order-list").append(newRow);
    counter++;

    fill_columns_for_filter(id_col);
  });

  $("table.order-list").on("click", ".ibtnDel", function (event) {
    $(this).closest("tr").remove();
    counter -= 1
  });
});



function calculateRow(row) {
  var price = +row.find('input[name^="price"]').val();

}

function calculateGrandTotal() {
  var grandTotal = 0;
  $("table.order-list").find('input[name^="price"]').each(function () {
    grandTotal += +$(this).val();
  });
  $("#grandtotal").text(grandTotal.toFixed(2));
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


  $("#saveQuery").click(function () {

    var type = document.getElementById("connectionType").options[document.getElementById("connectionType").selectedIndex].value;
    var connectionID = document.getElementById("connection").options[document.getElementById("connection").selectedIndex].value;
    var cacheResults = document.getElementById("cacheSelect").options[document.getElementById("cacheSelect").selectedIndex].value;
    var queryName = document.getElementById("queryName").value;

    var lengthColumns = document.getElementById("selectedColumns").options.length;
    var selected = [];
    var unselected = [];

    for (var i = 0; i < lengthColumns; i++) {
      elementList = document.getElementById("selectedColumns").options[i];

      if (elementList.selected == true) {
        selected.push(elementList.value);
      } else {
        unselected.push(elementList.value);
      }
    }

    var filterArray = [];
    var lengthfilter = document.getElementById("myTable").tBodies[0].rows.length;
    
    for (var i = 0; i < lengthfilter; i++) {
      element = [document.getElementById("columns_filter" + i).options[document.getElementById("columns_filter" + i).selectedIndex].value, document.getElementById("value_filter" + i).value];
      filterArray.push(element)
    }

    if (type == 'Rest') {
      var reqJson = {
        "restID": connectionID,
        "cache": cacheResults,
        "columnsfilter": unselected,
        "nameQuery": queryName,
        "rowsfilter": filterArray
      };

      var url = "http://localhost:8080/RestClient/SaveQuery";

    } else if (type == 'csv') {
      var reqJson = {
        "csvId": connectionID,
        "cache": cacheResults,
        "columnsfilter": unselected,
        "name": queryName,
        "rowsfilter": filterArray
      };

      var url = "http://localhost:8080/csv/SaveQuery";

    }else{
      var typeValidation = document.getElementById("hiveTable").options[document.getElementById("hiveTable").selectedIndex].value;

      if(typeValidation == 'ui'){
        var hiveTable = document.getElementById("hiveTableName").options[document.getElementById("hiveTableName").selectedIndex].text;

        var columnSelectQuery = '';
        for (var i = 0; i < selected.length; i++) {
          
          columnSelectQuery = columnSelectQuery + selected[i] + ','
        }
        columnSelectQuery = columnSelectQuery.slice(0,-1);
        
        var whereSelectQuery = '';
        if(filterArray.length != 0){
          whereSelectQuery += " WHERE ";
        }

        for (var i = 0; i < filterArray.length; i++) {
          
          whereSelectQuery = whereSelectQuery  + filterArray[i][0] + ' = '  + "'" + filterArray[i][1]  + "' AND "
        }
        whereSelectQuery = whereSelectQuery.slice(0,-4);
        
        var query = "SELECT " + columnSelectQuery + ' FROM ' + hiveTable + ' ' + whereSelectQuery;

        console.log(query);
        
        var reqJson= {
          "query": query,
          "hiveService": connectionID,
          "cache": cacheResults,
          "queryname": queryName
        };
        var url  = "http://localhost:8080/hive/SaveQuery";
      }else{
        var query = editorsql.getValue();
        var reqJson= {
          "query": query,
          "hiveService": connectionID,
          "cache": cacheResults,
          "queryname": queryName
        };
        var url  = "http://localhost:8080/hive/SaveQuery";      }
    }


    $.ajax({
      type: "POST",
      contentType: 'application/json',
      url: url,
      data: JSON.stringify(reqJson),

      success: function (data) {
        init_page();
        Swal.fire({
          position: 'top-end',
          title: JSON.stringify(data.message).slice(1, -1),
          showConfirmButton: false,
          timer: 1000
        })
        $('#newQueryWizardModal').modal('hide');

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

  $("#share_connection").click(function () {

    var pathToShare = document.getElementById("pathShare").value;
    var connectionIdShare = document.getElementById("connectionIdShare").value;

    var lengthColumns = document.getElementById("allUsers").options.length;
    var selected = [];

    for (var i = 0; i < lengthColumns; i++) {
      elementList = document.getElementById("allUsers").options[i];

      if (elementList.selected == true) {
        selected.push(elementList.value);
      }

    }

    var reqJSON = {
      "idConnection": connectionIdShare,
      "idUserShare": selected
    };
    var url = "http://localhost:8080" + pathToShare;

    console.log(url);

    $.ajax({
      type: "POST",
      contentType: 'application/json',
      url: url,
      data: JSON.stringify(reqJSON),

      success: function (data) {
        init_page();
        Swal.fire({
          position: 'top-end',
          title: JSON.stringify(data.message).slice(1, -1),
          showConfirmButton: false,
          timer: 1000
        })
        $('#shareModal').modal('hide');
      },
    });
  });

  init_page();

});