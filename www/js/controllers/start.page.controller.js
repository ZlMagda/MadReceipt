angular.module('start.page.controllers', [])

  .controller('StartPageCtrl', function ($scope, $state, $window, $http, $location, $stateParams, ReceiptsServer, DefService) {

    /*$scope.redirectPage = $location;*/

    $scope.$on('$ionicView.enter', function () {

      if ($location.search().token != undefined) {
        $window.sessionStorage.token = $location.search().token;


        ReceiptsServer.loginUserWithFacebook().then(function (response) {

          if (response.data != '"Login or password is incorrect."') {
            $scope.goTo('tab.newReceipt');

          } else {
            DefService.messagesMaker(response.data);
          }
        }, function (error) {
          console.log(error);
        });


      }
    });


    $scope.goTo = function (destinationPage) {
      DefService.goTo(destinationPage);
    };

  });
