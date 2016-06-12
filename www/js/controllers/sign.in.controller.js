angular.module('sign.in.controllers', [])
  .controller('SignInCtrl', function ($timeout, $scope, $window, $http, ReceiptsServer, DefService) {


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
