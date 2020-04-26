function initPage(){
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: "http://localhost:8080/market/getAllMarket",
        success: function (data) {

            var htmlToAdd= "";
            
            var allCategories = data.result.description;
            htmlToAdd += '<button class="btn btn-default filter-button" data-filter="all">All</button>';

            for(var i = 0; i < allCategories.length; i++){
                htmlToAdd += '<button class="btn btn-default filter-button" data-filter="'+allCategories[i] +'">'+allCategories[i] +'</button>';
            }
            document.getElementById("allFilters").innerHTML = htmlToAdd;
            
            var allCharts = data.result.allViz;

            htmlToAdd2 = '';
            for(var i = 0; i < allCharts.length; i++){
                
                
            htmlToAdd2 += '<div class="gallery_product col-lg-4 col-md-4 col-sm-4 col-xs-6 filter '+allCharts[i].description+'">';
            htmlToAdd2 += '<img src="http://fakeimg.pl/365x365/" class="img-responsive"></div>';
            }
            document.getElementById("chartimage").innerHTML = htmlToAdd2;


        }
    });
}

initPage();