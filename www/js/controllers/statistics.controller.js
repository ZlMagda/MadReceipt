angular.module('statistics.controllers', [])
  .controller('StatisticsCtrl', function ($scope, $window, DatabaseService, DefService) {

    $scope.$on('$ionicView.enter', function () {

      createDataForCategoryChart();
    });

    $scope.graph = {};
    /*$scope.graph.data = [

      [16, 15, 20, 12, 16, 12, 8]
    ];*/
    //$scope.graph.labels = ['Mon', 'Tue'];
    $scope.graph.series = ['Awake'];


    var getDateList = function () {
      var receiptsList = getReceiptsForStatistics();

      for (var i = 0; i < receiptsList.length; i++) {

        if(receiptsList[i].dateReceipt != undefined || receiptsList[i].dateReceipt != undefined) {
          dateList.push(formShortDate(receiptsList[i].dateReceipt));
        }

      }

      dateList = sortDateArray(dateList);
      dateList = unique(dateList);

      return dateList;
    };


    var getReceiptsForStatistics = function(){
      try {
        DatabaseService.selectAll().then(function (receiptsList) {
          return receiptsList;
        }, function (err) {
          return null;

        });

        } catch (ex) {
        return null;
      }
    };


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

            if(receiptsList[i].dateReceipt != undefined || receiptsList[i].dateReceipt != undefined) {
             dateList.push(formShortDate(receiptsList[i].dateReceipt));
             }


            companyList.push(receiptsList[i].companyName);

            totalSum = totalSum + receiptsList[i].price;

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

          $scope.graph.data = receiptsTotalByDateWrapper;
          $scope.graph.labels = dateList;

          console.log($scope.categories);
          console.log(receiptsTotalByDate);
          console.log(dateList);
          console.log($scope.receiptsTotalByDate);

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
      var shortDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
      return shortDate;
    };


    var sortDateArray = function (dateArray) {
      dateArray.sort(function (a, b) {
        var dateA = a.split("-");
        var dateB = a.split("-");

        if (dateA[0] < dateB[0]) {
          if(dateA[1] < dateB[1]){
            if(dateA[2] < dateB[2]){
              return -1;
            } else if(dateA[2] > dateB[2]){
              return 1;
            }
          } else if(dateA[1] > dateB[1]){
            return 1;
          }
          return 0;

        } else if(dateA[0] > dateB[0]){
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



  });
