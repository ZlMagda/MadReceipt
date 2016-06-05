angular.module('default.services', ['ionic', 'ngCordova'])

  .factory('DefService', function ($state, $window, $ionicLoading, $ionicPopup) {


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
      return $ionicPopup.alert({
        template: message
      })

      /* try {
       -        $cordovaToast
       -          .show(message, 'long', 'bottom')
       -          .then(function (success) {
       -            // success
       -          }, function (error) {
       -
       -          });
       -      } catch (ex) {
       -        $window.alert(message);
       -      }*/
    };


    defaultServices.goTo = function (destinationPage) {

      $state.go(destinationPage);
    };


    return defaultServices;
  });
