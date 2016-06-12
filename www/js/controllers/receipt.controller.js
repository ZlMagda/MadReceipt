angular.module('receipt.controllers', [])
  .controller('ReceiptCtrl', function ($scope, $state, $window, $stateParams, DatabaseService, ReceiptsServer, DefService) {

    $scope.$on('$ionicView.enter', function () {
      $scope.receipt = [];
      DefService.show();

      try {
        DatabaseService.select($stateParams.receiptId).then(function (receipt) {

          DefService.hide();
          $scope.receipt = receipt;
          if(receipt.dateReceipt != undefined){
            $scope.receipt.dateReceipt =new Date(receipt.dateReceipt);
          }

        }, function (error) {
          DefService.hide();
          console.log(error);

        });
      } catch (ex) {
        DefService.hide();
        $scope.errorMessage = "Unfortunately some browsers or devices do not support saving receipts locally:(";
      }
    });


    $scope.removeReceipt = function (receipt) {

      if(receipt.online == 1){
        ReceiptsServer.deleteReceipt(receipt.server_id).then(function (message) {
          DefService.goTo('tab.receiptsList');

        }, function (error) {
          if (error.data == "Unauthorized") {
            DefService.signInMessage();
          }
          console.log(error);

        });

      } else {

        DatabaseService.remove(receipt._id).then(function () {
          $state.go('tab.receiptsList');
        }, function (error) {
          console.log(error);
        });
      }
    };


    $scope.updateReceipt = function (receipt) {
      DatabaseService.update(receipt).then(function () {
        DefService.messagesMaker("Receipt updated");
        DefService.goTo('tab.receiptsList');

      }, function (error) {
        console.log(error);

      });
    };

    $scope.updateReceiptOnServer = function (receipt) {
      console.log(receipt.dateReceipt);
      if (receipt.server_id != 0) {
        if ($window.sessionStorage.token == undefined) {
          DefService.signInMessage();

        } else {
          ReceiptsServer.updateReceipt(receipt).then(function () {
            DefService.messagesMaker("Receipt updated");
            $scope.updateReceipt();

          }, function (error) {
            console.log(error);

          });
        }
      } else {
        DefService.messagesMaker("Receipt is not online");
      }
    };


  });
