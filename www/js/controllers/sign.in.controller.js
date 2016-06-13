angular.module('sign.in.controllers', [])
  .controller('SignInCtrl', function ($timeout, $scope, $window, $location, $http, ReceiptsServer, DefService) {

    $scope.$on('$ionicView.enter', function () {
      console.log( $location.absUrl());
      console.log($location.path());

      var url= $location.absUrl();
      url = url.substring(0, url.length - 7);
      url = url + "start-page";
      console.log(url);

      $scope.redirectUrl = url;

    });

    /*$scope.pageUrl = function(){
      console.log( $location.absUrl());

      var url= $location.absUrl();
      url = url.substring(0, url.length - 7);

      url = url + "start-page";
      return url;
    };*/


    $scope.signIn = function (email, password) {

      ReceiptsServer.loginUser(email, password).then(function (response) {
        if (response.data != 'Login or password is incorrect.' || response.data == undefined) {
          $window.sessionStorage.token = response.data.token;
          DefService.goTo('tab.newReceipt');

        } else {
          DefService.messagesMaker('Login or password is incorrect');
        }

      }, function (error) {
        console.log(error);
      });

    };

  });
