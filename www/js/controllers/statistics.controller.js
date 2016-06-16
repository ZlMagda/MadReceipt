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


    var categoriesChart;
    var companiesChart;
    var dateChart;

    var categoriesChartData;
    var companiesChartData;
    var dateChartData;

    var categoriesChartLabels;
    var companiesChartLabels;
    var dateChartLabels;

    var categoriesIndex;
    var companiesIndex;
    var dateIndex;

    var itemsOnChart = 4;


    setInterval(function () {

      if (categoriesIndex >= (categoriesChartData.length - 1)) {
        categoriesIndex = 0;
      } else {
        ++categoriesIndex;
      }

      if (companiesIndex >= (companiesChartData.length - 1)) {
        companiesIndex = 0;
      } else {
        ++companiesIndex;
      }

      if (dateIndex >= (dateChartData.length - 1)) {
        dateIndex = 0;
      } else {
        dateIndex++;
      }


      companiesChart.addData([companiesChartData[companiesIndex]], companiesChartLabels[companiesIndex]);
      companiesChart.removeData();


      categoriesChart.addData([categoriesChartData[categoriesIndex]], categoriesChartLabels[categoriesIndex]);
      categoriesChart.removeData();

      dateChart.addData([dateChartData[dateIndex]], dateChartLabels[dateIndex]);
      dateChart.removeData();


    }, 5000);


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

          dateList = unique(dateList);
          dateList = sortDateArray(dateList);

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

          categoriesChartLabels = categoriesList;
          categoriesChartData = receiptsNoByCategory;
          categoriesIndex = 0;

          dateChartLabels = dateList;
          dateChartData = receiptsTotalByDate;
          dateIndex = 0;

          companiesChartLabels = companyList;
          companiesChartData = receiptsTotalByCompany;
          companiesIndex = 0;


          console.log("subARray0");
          console.log(dateList.subarray(0, 2));


          respondCategoriesCanvas(categoriesChartDataFunction(categoriesList.subarray(categoriesIndex, categoriesIndex + itemsOnChart), receiptsNoByCategory.subarray(categoriesIndex, categoriesIndex + itemsOnChart)));
          respondCompaniesCanvas(companyChartDataFunction(companyList.subarray(companiesIndex, companiesIndex + itemsOnChart), receiptsTotalByCompany.subarray(companiesIndex, companiesIndex + itemsOnChart)));
          respondDateCanvas(dateChartDataFunction(dateList.subarray(dateIndex, dateIndex + itemsOnChart), receiptsTotalByDate.subarray(dateIndex, dateIndex + itemsOnChart)), dtt);

          companiesIndex = companiesIndex + itemsOnChart;
          categoriesIndex = categoriesIndex + itemsOnChart;
          dateIndex = dateIndex + itemsOnChart;


          console.log(categoriesList);
          console.log(receiptsNoByCategory);
          console.log(companyList);
          console.log(receiptsTotalByCompany);
          console.log(dateList);
          console.log(receiptsTotalByDate);


          $scope.totalSum = parseFloat(totalSum).toFixed(2);

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
      var shortDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
      return shortDate;
    };


    var sortDateArray = function (dateArray) {
      dateArray.sort(function (a, b) {
        var dateA = a.split("/");
        var dateB = b.split("/");

        /*console.log("in compare");
        console.log(dateA);
        console.log(dateB);*/

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
        } else if (dateA[0] == dateB[0]){
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

    var clone = function (obj) {
      if (null == obj || "object" != typeof obj) return obj;
      var copy = obj.constructor();
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
      }
      return copy;
    };

    Array.prototype.subarray = function (start, end) {
      if (end >= this.length) {
        end = this.length;
      }
      var newArray = clone(this);
      return newArray.slice(start, end);
    };


    $scope.signInOut = function () {
      DefService.signInOut();
    };

    $scope.goHome = function () {
      DefService.goTo('start');
    };


    var categoriesChartDataFunction = function (categories, receiptsNoByCategory) {
      return {
        labels: categories,
        datasets: [{
          fillColor: ['#581845'],
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
      categoriesChart = new Chart(ct).Bar(data, {animationSteps: 30});
    }


    var companyChartDataFunction = function (companies, receiptsNoByCompany) {
      return {
        labels: companies,
        datasets: [{
          fillColor: '#FF5733',
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
      comp.attr('width', jQuery("#companyDiv").width());
      comp.attr('height', jQuery("#companyDiv").height() * 3);
      companiesChart = new Chart(compt).Line(data, {animationSteps: 30});
    }


    var dateChartDataFunction = function (dates, totalNoByDate) {
      return {
        labels: dates,
        datasets: [{
          fillColor: '#FF5733',
          data: totalNoByDate
        }]
      }
    };

    $(window).resize(respondDateCanvas);
    var dt = $('#date-chart');
    var dtt = dt.get(0).getContext('2d');
    var dttx = document.getElementById("date-chart").getContext("2d");


    function respondDateCanvas(data, dtt) {
      comp.attr('width', jQuery("#dateDiv").width());
      comp.attr('height', jQuery("#dateDiv").height() * 3);

      dateChart = new Chart(dtt).Line(data, {animationSteps: 30});

    }

  });
