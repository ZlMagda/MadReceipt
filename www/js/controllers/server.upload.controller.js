angular.module('serverUpload.controllers', [])
  .controller('ServerUploadCtrl', function ($scope, $window, DatabaseService, ReceiptsServer, DefService) {

    $scope.selectedReceipts = {};

    $scope.$on('$ionicView.enter', function () {
      $scope.receipts = [];
      $scope.getOfflineReceipts();
    });


    $scope.checkAll = function () {
      angular.forEach($scope.receipts, function (receipt) {
        $scope.selectedReceipts[receipt._id] = true;
      });
    };

    $scope.getOfflineReceipts = function () {
      $scope.receiptsNo = 0;
      DefService.show();
      try {
        DatabaseService.selectAllOffline().then(function (receiptsList) {

          angular.forEach(receiptsList, function (receipt) {
            $scope.selectedReceipts[receipt._id] = false;
          });


          $scope.receipts = receiptsList;
          $scope.receiptsNo = receiptsList.length;


          DefService.hide();

        }, function (error) {
          DefService.hide();
          console.log(error);

        });
      } catch (ex) {
        DefService.hide();
        $scope.errorMessage = "Unfortunately some browsers or devices do not support saving receipts locally:(";
      }

    };

    $scope.sendToServer = function () {


      DefService.goTo('tab.receiptsList');

      var selectedReceiptsNo = 0;
      var proceedReceipts = 0;


      angular.forEach($scope.receipts, function (receipt) {
        DefService.show();
        if ($scope.selectedReceipts[receipt._id] == true) {
          try {
            ReceiptsServer.insertReceipt(receipt).then(function () {
              selectedReceiptsNo = selectedReceiptsNo + 1;

              DatabaseService.updateOnlineStatus(receipt._id);


            }, function (err) {
              DefService.hide();
              proceedReceipts += 1;
              console.log('Error occured while sending receipt');

            });
          } catch (ex) {
            DefService.hide();
            proceedReceipts += 1;
            $scope.errorMessage = "Unfortunately some browsers or devices do not support saving receipts locally:(";
          }
        } else {
          proceedReceipts += 1;
        }


      });
      DefService.hide();


    };

    $scope.cancelSending = function () {
      DefService.goTo('tab.receiptsList');

    };


  });
