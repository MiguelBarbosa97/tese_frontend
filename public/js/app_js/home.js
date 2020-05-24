$(document).ready(function () {
    var idUser = sessionStorage.getItem('user_id');

    var arrayJson = ["primary", "success", "info"];
    function pieChart(label, percentage) {
        var html = '';
        for (var index = 0; index < label.length; index++) {
            html += '<span class="mr-2">';
            html += '<i class="fas fa-circle text-' + arrayJson[index] + '"></i> ' + label[index];
            html += '</span>';
        }
        document.getElementById("legendPie").innerHTML = html;
        // Set new default font family and font color to mimic Bootstrap's default styling
        Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        Chart.defaults.global.defaultFontColor = '#858796';

        // Pie Chart Example
        var ctx = document.getElementById("myPieChart");
        var myPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: label,
                datasets: [{
                    data: percentage,
                    backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
                    hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                }],
            },
            options: {
                maintainAspectRatio: false,
                tooltips: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    caretPadding: 10,
                },
                legend: {
                    display: false
                },
                cutoutPercentage: 80,
            },
        });

    }

    function areaChart(json) {
        // Set new default font family and font color to mimic Bootstrap's default styling
        Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        Chart.defaults.global.defaultFontColor = '#858796';

        function number_format(number, decimals, dec_point, thousands_sep) {
     
            number = (number + '').replace(',', '').replace(' ', '');
            var n = !isFinite(+number) ? 0 : +number,
                prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
                dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
                s = '',
                toFixedFix = function (n, prec) {
                    var k = Math.pow(10, prec);
                    return '' + Math.round(n * k) / k;
                };
            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
            s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
            }
            if ((s[1] || '').length < prec) {
                s[1] = s[1] || '';
                s[1] += new Array(prec - s[1].length + 1).join('0');
            }
            return s.join(dec);
        }

        // Area Chart Example
        var ctx = document.getElementById("myAreaChart");
        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: json.mes,
                datasets: [{
                    label: "Dashboards",
                    lineTension: 0.3,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: json.mesDash,
                }, {
                    label: "Visualizations",
                    lineTension: 0.3,
                    backgroundColor: "rgba(91, 192, 222, 0.05)",
                    borderColor: "rgb(91, 192, 222)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgb(91, 192, 222)",
                    pointBorderColor: "rgb(91, 192, 222)",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "rgb(91, 192, 222)",
                    pointHoverBorderColor: "rgb(91, 192, 222)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: json.mesViz,
                }
                ],
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    xAxes: [{
                        time: {
                            unit: 'date'
                        },
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 7
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            maxTicksLimit: 5,
                            padding: 10,
                            // Include a dollar sign in the ticks
                            callback: function (value, index, values) {
                                return  number_format(value);
                            }
                        },
                        gridLines: {
                            color: "rgb(234, 236, 244)",
                            zeroLineColor: "rgb(234, 236, 244)",
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineBorderDash: [2]
                        }
                    }],
                },
                legend: {
                    display: false
                },
                tooltips: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    titleMarginBottom: 10,
                    titleFontColor: '#6e707e',
                    titleFontSize: 14,
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    intersect: false,
                    mode: 'index',
                    caretPadding: 10,
                    callbacks: {
                        label: function (tooltipItem, chart) {
                            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                            return datasetLabel + ': ' + number_format(tooltipItem.yLabel);
                        }
                    }
                }
            }
        });

    }

    var arrayType = ["success", "info", "warning"];
    function loadTypes(types) {
        htmlConn = "";
        htmlQuery = "";

        for (var i = 0; i < types.length; i++) {
            htmlConn += '<h4 class="small font-weight-bold">' + types[i].type + '<span class="float-right">' + types[i].percConnection + '%</span></h4>';
            htmlConn += '<div class="progress mb-4">';
            htmlConn += '<div class="progress-bar bg-' + arrayType[i] + '" role="progressbar" style="width: ' + types[i].percConnection + '%" aria-valuenow="' + types[i].percConnection + '" aria-valuemin="0" aria-valuemax="100"></div></div>';


            htmlQuery += '<h4 class="small font-weight-bold">' + types[i].type + '<span class="float-right">' + types[i].percQuery + '%</span></h4>';
            htmlQuery += '<div class="progress mb-4">';
            htmlQuery += '<div class="progress-bar bg-' + arrayType[i] + '" role="progressbar" style="width: ' + types[i].percQuery + '%" aria-valuenow="' + types[i].percQuery + '" aria-valuemin="0" aria-valuemax="100"></div></div>';
        }
        document.getElementById("typesConnections").innerHTML = htmlConn;
        document.getElementById("typesQueries").innerHTML = htmlQuery;
    }

    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/users/getHome/" + idUser,
        success: function (data) {
            console.log(JSON.stringify(data.result));
            pieChart(data.result.categories, data.result.categoriesPercentage);
            loadTypes(data.result.connectionsQueries);
            areaChart(data.result.areaChart);
            document.getElementById("numberCharts").innerHTML = data.result.countViz;
            document.getElementById("numberChartMarket").innerHTML = data.result.countChart;
            document.getElementById("numberUsed").innerHTML = data.result.numberUsed;
            document.getElementById("numberLikes").innerHTML = data.result.numberLikes;

        }
    });
});