angular.module('statistics.controllers', [])
  .controller('StatisticsCtrl', function ($scope, $window, $ionicHistory, DatabaseService, DefService) {

    $scope.$on('$ionicView.enter', function () {

      console.log("in view enter");
      createDataForCategoryChart();
    });

    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };


    $scope.$on("$ionicView.leave", function (scopes, states) {
      console.log("in leave");

      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();

    });


    /*    var canvas = document.getElementById('updating-chart'),
     ctx = canvas.getContext('2d'),
     startingData = {
     labels: [1, 2, 3, 4, 5, 6, 7],
     datasets: [
     {
     fillColor: "rgba(220,220,220,0.2)",
     strokeColor: "rgba(220,220,220,1)",
     pointColor: "rgba(220,220,220,1)",
     pointStrokeColor: "#fff",
     data: [65, 59, 80, 81, 56, 55, 40]
     },
     {
     fillColor: "rgba(151,187,205,0.2)",
     strokeColor: "rgba(151,187,205,1)",
     pointColor: "rgba(151,187,205,1)",
     pointStrokeColor: "#fff",
     data: [28, 48, 40, 19, 86, 27, 90]
     }
     ]
     },
     latestLabel = startingData.labels[6];

     var myLiveChart = new Chart(ctx).Line(startingData, {animationSteps: 15});


     setInterval(function(){
     myLiveChart.addData([Math.random() * 100, Math.random() * 100], ++latestLabel);
     myLiveChart.removeData();
     }, 5000);*/


    var createDataForCategoryChart = function () {


      var categoriesList = [];
      var dateList = [];
      var receiptsNoByCategory = [];
      var receiptsTotalByDate = [];
      var receiptsTotalByCompany = [];
      var totalSum = 0;
      var companyList = [];


      DefService.show();
      try {
        DatabaseService.selectAll().then(function (receiptsList) {

          $scope.receiptsNo = receiptsList.length;
          $scope.medals_colours = [{fillColor: ['#087D76', '#B3BC3A', '#38B665', '#8B4A9D']}];


          for (var i = 0; i < receiptsList.length; i++) {

            if (receiptsList[i].dateReceipt != undefined || receiptsList[i].dateReceipt != undefined) {
              dateList.push(formShortDate(receiptsList[i].dateReceipt));
            }

            if (receiptsList[i].companyName != undefined) {
              companyList.push(receiptsList[i].companyName);
            }

            if (receiptsList[i].price != undefined) {
              totalSum = totalSum + receiptsList[i].price;
            }

            if (categoriesList.indexOf(receiptsList[i].category) == -1) {
              categoriesList.push(receiptsList[i].category);
            }
          }

          dateList = sortDateArray(dateList);
          dateList = unique(dateList);
          companyList = unique(companyList);

          for (var i = 0; i < dateList.length; i++) {
            receiptsTotalByDate[i] = (parseFloat(countPriceInDate(dateList[i], receiptsList)));
          }

          for (var i = 0; i < companyList.length; i++) {
            receiptsTotalByCompany[i] = (parseFloat(countPriceInCompany(companyList[i], receiptsList)));
          }
          companyList[companyList.indexOf(null)] = "Company name is not defined";

          for (var i = 0; i < categoriesList.length; i++) {
            receiptsNoByCategory[i] = (parseInt(countReceiptsInCategory(categoriesList[i], receiptsList)));
          }
          categoriesList[categoriesList.indexOf(null)] = "Category is not defined";

          var receiptsNoWrapper = [];

          $scope.categories = categoriesList;
          receiptsNoWrapper.push(receiptsNoByCategory);
          $scope.receiptsByCategory = receiptsNoWrapper;

          $scope.dates = dateList;
          var receiptsTotalByDateWrapper = [];
          receiptsTotalByDateWrapper.push(receiptsTotalByDate);
          $scope.receiptsTotalByDate = receiptsTotalByDateWrapper;

          $scope.companies = companyList;
          var receiptsTotalByCompanyWrapper = [];
          receiptsTotalByCompanyWrapper.push(receiptsTotalByCompany);
          $scope.receiptsTotalByCompany = receiptsTotalByCompanyWrapper;


          $(window).resize(respondDateCanvas);
          var dt = $('#date-chart');
          var dtt = dt.get(0).getContext('2d');
          var dttx = document.getElementById("date-chart").getContext("2d");


          respondCategoriesCanvas(categoriesChartData(categoriesList, receiptsNoByCategory));
          respondCompaniesCanvas(companyChartData(companyList, receiptsTotalByCompany));
          respondDateCanvas(dateChartData(dateList, receiptsTotalByDate), dtt);


          console.log(categoriesList);
          console.log(receiptsNoByCategory);
          console.log(companyList);
          console.log(receiptsTotalByCompany);
          console.log(dateList);
          console.log(receiptsTotalByDate);


          $scope.totalSum = totalSum;

          DefService.hide();

        }, function (err) {
          DefService.hide();
          console.log(error);

        });
      } catch (ex) {
        DefService.hide();
      }
    };

    var countReceiptsInCategory = function (category, receiptsList) {
      var numberOfReceipts = 0;
      for (var i = 0; i < receiptsList.length; i++) {
        if (receiptsList[i].category == category) {
          numberOfReceipts++;
        }
      }
      return numberOfReceipts;
    };

    var countPriceInDate = function (dateReceipt, receiptsList) {
      var sum = 0;
      for (var i = 0; i < receiptsList.length; i++) {
        if (formShortDate(receiptsList[i].dateReceipt) == dateReceipt) {
          sum = sum + receiptsList[i].price;
        }
      }
      return sum;
    };

    var countPriceInCompany = function (companyName, receiptsList) {
      var sum = 0;
      for (var i = 0; i < receiptsList.length; i++) {
        if (receiptsList[i].companyName == companyName) {
          sum = sum + receiptsList[i].price;
        }
      }
      return sum;
    };


    var formShortDate = function (longDate) {
      var date = new Date(longDate);
      /*console.log(longDate);
       console.log(date.getFullYear());
       console.log(date.getMonth()+1);
       console.log(date.getDate());*/
      var shortDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      return shortDate;
    };


    var sortDateArray = function (dateArray) {
      dateArray.sort(function (a, b) {
        var dateA = a.split("-");
        var dateB = a.split("-");

        if (dateA[0] < dateB[0]) {
          if (dateA[1] < dateB[1]) {
            if (dateA[2] < dateB[2]) {
              return -1;
            } else if (dateA[2] > dateB[2]) {
              return 1;
            }
          } else if (dateA[1] > dateB[1]) {
            return 1;
          }
          return 0;

        } else if (dateA[0] > dateB[0]) {
          return 1;
        }


        return 0;
      });

      return dateArray;
    };

    var unique = function (origArr) {
      var newArr = [],
        origLen = origArr.length,
        found, x, y;

      for (x = 0; x < origLen; x++) {
        found = undefined;
        for (y = 0; y < newArr.length; y++) {
          if (origArr[x] === newArr[y]) {
            found = true;
            break;
          }
        }
        if (!found) {
          newArr.push(origArr[x]);
        }
      }
      return newArr;
    };


    $scope.signInOut = function () {
      DefService.signInOut();
    };

    $scope.goHome = function () {
      DefService.goTo('start');
    };


    var categoriesChartData = function (categories, receiptsNoByCategory) {
      return {
        labels: categories,
        datasets: [{
          fillColor: ['#DAF7A6', '#FFC300', '#FF5733', '#C70039', '#581845'],
          data: receiptsNoByCategory
        }]
      }
    };

    var options = {animation: false};

    //Get the context of the canvas element we want to select
    var c = $('#category-chart');
    var ct = c.get(0).getContext('2d');
    var ctx = document.getElementById("category-chart").getContext("2d");

    $(window).resize(respondCategoriesCanvas);

    function respondCategoriesCanvas(data) {
      c.attr('width', jQuery("#categoryDiv").width());
      c.attr('height', jQuery("#categoryDiv").height() * 3);
      newCategoriesChart = new Chart(ct).Bar(data, options);
    }


    var companyChartData = function (companies, receiptsNoByCompany) {
      return {
        labels: companies,
        datasets: [{
          fillColor: ['#DAF7A6', '#FFC300', '#FF5733', '#C70039', '#581845'],
          data: receiptsNoByCompany
        }]
      }
    };

    //Get the context of the canvas element we want to select
    var comp = $('#company-chart');
    var compt = comp.get(0).getContext('2d');
    var comptx = document.getElementById("company-chart").getContext("2d");

    $(window).resize(respondCompaniesCanvas);

    function respondCompaniesCanvas(data) {


      console.log("in resize");
      comp.attr('width', jQuery("#companyDiv").width());
      comp.attr('height', jQuery("#companyDiv").height() * 3);
      console.log(jQuery("#companyDiv").width());
      console.log(jQuery("#companyDiv").width() * 3);
      newCompaniesChart = new Chart(compt).Bar(data, options);
    }


    var dateChartData = function (dates, totalNoByDate) {
      return {
        labels: dates,
        datasets: [{

          strokeColor: "rgba(220,220,220,1)",
          data: totalNoByDate
        }]
      }
    };


    function respondDateCanvas(data, dtt) {
      comp.attr('width', jQuery("#dateDiv").width());
      comp.attr('height', jQuery("#dateDiv").height() * 3);

      newDateChart = new Chart(dtt).Line(data, options);

    }

  });
