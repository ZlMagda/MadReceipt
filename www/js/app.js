// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',  'ngCordova', 'jkuri.datepicker', 'chart.js', 'ion-floating-menu', 'starter.controllers', 'starter.services',  'ngCordova', 'default.services', 'start.page.controllers', 'sign.in.controllers', 'account.controllers', 'newReceipts.controllers', 'receipt.controllers', 'serverUpload.controllers', 'receiptsList.controllers', 'statistics.controllers', 'server.services', 'photos.and.files.services', 'database.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider


    .state('start', {
      url: '/start-page',
      templateUrl: 'templates/start-page.html',
      controller: 'StartPageCtrl'
    })

    .state('signin', {
      url: '/sign-in',
      templateUrl: 'templates/sign-in.html',
      controller: 'SignInCtrl'
    })

    .state('createAccount', {
      url: '/create-account',
      templateUrl: 'templates/create-account.html',
      controller: 'CreateAccountCtrl'
    })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

    .state('tab.newReceipt', {
      url: '/newReceipt',
      views: {
        'tab-new-receipts': {
          templateUrl: 'templates/tab-new-receipts.html',
          controller: 'NewReceiptsCtrl'
        }
      }
    })
  // Each tab has its own nav history stack:

    .state('tab.receiptsList', {
      url: '/receiptsList',
      views: {
        'tab-receipts-list': {
          templateUrl: 'templates/tab-receipts-list.html',
          controller: 'ReceiptsListCtrl'
        }
      }
    })

    .state('tab.receipt-detail', {
      url: '/receipts/:receiptId',
      views: {
        'tab-receipts-list': {
          templateUrl: 'templates/receipt-detail.html',
          controller: 'ReceiptCtrl'
        }
      }
    })

    .state('tab.receipt-upload', {
      url: '/upload',
      views: {
        'tab-receipts-list': {
          templateUrl: 'templates/receipts-server-upload.html',
          controller: 'ServerUploadCtrl'
        }
      }
    })

    .state('tab.statistics', {
      url: '/statistics',
      views: {
        'tab-statistics': {
          templateUrl: 'templates/tab-statistics.html',
          controller: 'StatisticsCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/start-page');

});
