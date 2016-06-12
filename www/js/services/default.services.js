angular.module('default.services', ['ionic', 'ngCordova'])

  .factory('DefService', function ($state, $window, $ionicLoading, $ionicPopup, $cordovaToast) {


    var defaultServices = {};

    defaultServices.signInOut = function () {
      if ($window.sessionStorage.token != null) {
        delete $window.sessionStorage.token;
        $state.go('start');
      } else {
        $state.go('signin');
      }
    };

    defaultServices.show = function () {
      $ionicLoading.show({
        template: '<ion-spinner class="spinner-energized"></ion-spinner>'


      });
    };
    defaultServices.hide = function () {
      $ionicLoading.hide();
    };


    defaultServices.messagesMaker = function (message) {


       try {
               $cordovaToast
                 .show(message, 'long', 'bottom')
                 .then(function (success) {
                   // success
                 }, function (error) {

                 });
             } catch (ex) {
         $ionicPopup.alert({
           template: message
         });
             }
    };

    defaultServices.signInMessage = function () {
      $ionicPopup.confirm({
          template: 'You must be logged in',
          okText: 'Log in',
          cancelText: 'Cancel'
        })
        .then(function (buttonIndex) {
          // no button = 0, 'OK' = 1, 'Cancel' = 2
          if (buttonIndex == 1) {
            $state.go('signin');
          }
        });
    };


    defaultServices.goTo = function (destinationPage) {

      $state.go(destinationPage);
    };


    return defaultServices;
  });
