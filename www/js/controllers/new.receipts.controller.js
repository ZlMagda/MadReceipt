angular.module('newReceipts.controllers', [])

  .controller('NewReceiptsCtrl', function ($scope, $window, $cordovaImagePicker, $cordovaDialogs, $ionicPopup, PhotosAndFilesService, DatabaseService, ReceiptsServer, DefService) {

    $scope.receiptsImagesList = [];

    $scope.takePicture = function () {

      document.addEventListener("deviceready", function () {

        PhotosAndFilesService.getPicture().then(function (selectedImage) {

          $scope.receiptsImagesList.push("data:image/jpeg;base64," + selectedImage);
        }, function (err) {
          DefService.messagesMaker('Problem with taking picture. Try again');
        });
      }, DefService.messagesMaker("Cannot take photo on this device"));

    };

    $scope.getPicturesFromGallery = function () {

      try {
        PhotosAndFilesService.getPicturesFromGallery().then(function (selectedImages) {
          DefService.show();
          for (var i = 0; i < selectedImages.length; i++) {
            $scope.receiptsImagesList.push(selectedImages[i]);
          }
          DefService.hide();
        }, function (error) {
          console.log(error);
          DefService.hide();
        });

      } catch (ex) {
        DefService.messagesMaker("Cannot open Gallery on this device");
        DefService.hide();
      }
    };


    $scope.getFiles = function (files) {
      DefService.show();
      if (files) {
        [].forEach.call(files, getFilesHelper);
      } else {
        DefService.hide();
      }


    };


    $scope.deleteImage = function (imageId) {
      $ionicPopup.confirm({
        template: 'Are you sure you want to delete this receipt?',
        okText: 'Ok',
        cancelText: 'Cancel'
      })
        .then(function (buttonIndex) {
          // no button = 0, 'OK' = 1, 'Cancel' = 2
          if (buttonIndex == 1) {
            $scope.receiptsImagesList.splice(imageId, 1);
          }
        });
    };


    $scope.deleteAllImages = function () {

      $scope.receiptsImagesList = [];
    };


    $scope.addReceiptsLocaly = function () {
      if ($scope.receiptsImagesList.length) {
        DefService.show();
        try {
          var receiptsList = $scope.receiptsImagesList;
          DatabaseService.insert(receiptsList).then(function () {

            DefService.hide();
            DefService.messagesMaker("Receipts saved");
            DefService.goTo("tab.receiptsList");

          }, function (error) {
            DefService.hide();
            console.log(error);

          });
        } catch (ex) {
          DefService.hide();

        }
      } else {
        DefService.messagesMaker("No receipts selected");
      }
    };


    $scope.addReceiptsToServer = function () {
      if ($scope.receiptsImagesList.length) {


        angular.forEach($scope.receiptsImagesList, function (receipt) {
          DefService.show();

          try {
            ReceiptsServer.insertReceiptWithImageOnly(receipt).then(function () {
              console.log("send success");
              DatabaseService.updateOnlineStatus(receipt._id);

              DefService.goTo('tab.receiptsList');
            }, function (error) {
              DefService.hide();
              console.log(error);

            });
          } catch (ex) {
            DefService.hide();
            $scope.errorMessage = "Unfortunately some browsers or devices do not support saving receipts locally:(";
          }

        });

        DefService.hide()
      } else {
        DefService.messagesMaker("No receipts selected");
      }

    };


    $scope.save = function () {

      var message = "Do you want to save receipts in our server?";
      $ionicPopup.show({
        template: message,
        buttons: [{
          text: 'Send to server',
          type: 'button-default',
          onTap: function() {
            if ($window.sessionStorage.token == undefined) {
              DefService.messagesMaker("You must be logged in");
            } else {
              $scope.addReceiptsToServer();
              $scope.receiptsImagesList = [];
            }
          }
        }, {
          text: 'Use locally',
          type: 'button-default',
          onTap: function() {
            $scope.addReceiptsLocaly();
            $scope.receiptsImagesList = [];
          }
        }]
      })
    };

    $scope.signInOut = function () {
      DefService.signInOut();
    };

    $scope.goHome = function () {
      DefService.goTo('start');
    };


    var getFilesHelper = function (file) {
      DefService.show();
      PhotosAndFilesService.readFiles(file, $scope).then(function (selectedImages) {

        $scope.receiptsImagesList.push(selectedImages);
        DefService.hide();
      }, function (error) {
        DefService.hide();
        console.log(error);

      });
    };


  });
