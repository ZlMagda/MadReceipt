angular.module('receipt.controllers', [])
  .controller('ReceiptCtrl', function ($scope, $state, $window, $stateParams, DatabaseService, ReceiptsServer, DefService) {

    $scope.$on('$ionicView.enter', function () {
      $scope.receipt = [];
      DefService.show();

      try {
        DatabaseService.select($stateParams.receiptId).then(function (receipt) {

          DefService.hide();
          $scope.receipt = receipt;

        }, function (error) {
          DefService.hide();
          console.log(error);

        });
      } catch (ex) {
        DefService.hide();
        $scope.errorMessage = "Unfortunately some browsers or devices do not support saving receipts locally:(";
      }
    });


    $scope.removeReceipt = function (receiptId) {
      DatabaseService.remove(receiptId).then(function () {
        $state.go('tab.receiptsList');

      }, function (error) {
        console.log(error);

      });
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
      if (receipt.server_id != 0) {
        if ($window.sessionStorage.token == undefined) {
          DefService.messagesMaker("You're not logged in");
          DefService.goTo('signin');
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
