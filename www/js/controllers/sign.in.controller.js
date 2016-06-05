angular.module('sign.in.controllers', [])
  .controller('SignInCtrl', function ($timeout, $scope, $window,$http, ReceiptsServer, DefService) {



    $scope.signIn = function (email, password) {

     /* ReceiptsServer.loginUser(email, password).then(function (response) {

        if (response.data != '"Login or password is incorrect."') {

          $window.sessionStorage.token = response.data.token;
          DefService.goTo('tab.newReceipt');

        } else {
          DefService.messagesMaker(response.data);
        }
      }, function (error) {

        console.log(error);
      });*/

      var dataToPost = 'email=' + email + '&password=' + password;

      var req = {
        method: 'POST',
        url: 'https://walletapplication.herokuapp.com/api/local/login',
        headers: {'Content-Type': 'application/x-www-form-urlencoded',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
          "Access-Control-Max-Age": "3600",
          "Access-Control-Allow-Headers": "x-requested-with"},
        data: dataToPost
      };


      $http(req).then(function (response) {

        if (response.data != '"Login or password is incorrect."') {

          $window.sessionStorage.token = response.data.token;
          DefService.goTo('tab.newReceipt');

        } else {
          DefService.messagesMaker(response.data);
        }
      }, function (error) {

        console.log(error);
      });
    };

  });
