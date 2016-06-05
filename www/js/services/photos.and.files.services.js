angular.module('photos.and.files.services', [])

  .factory('PhotosAndFilesService', ['$q', '$cordovaCamera', '$cordovaImagePicker', function ($q, $cordovaCamera, $cordovaImagePicker) {

    var onLoad = function (reader, deferred, scope) {
      return function () {
        scope.$apply(function () {
          deferred.resolve(reader.result);
        });
      };
    };


    var getReader = function (deferred, scope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, scope);
      return reader;
    };



    return {
      getPicture: function () {
        var q = $q.defer();

        var options = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 250,
          targetHeight: 250,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation: true
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {

          q.resolve(imageData);
        }, function (err) {
          q.reject(err);
        }, options);

        return q.promise;
      },

      getPicturesFromGallery: function () {
        var q = $q.defer();

        var options = {
          maximumImagesCount: 20,
          width: 250,
          height: 250,
          quality: 80
        };
        $cordovaImagePicker.getPictures(options).then(function (results) {
          q.resolve(results);
        }, function (err) {
          q.reject(err);
        }, options);
        return q.promise;

      },

      readFiles: function (file, scope) {


        var deferred = $q.defer();

        /*for (var i = 0; i < file.length; i++) {
         var reader = getReader(deferred, scope);
         reader.readAsDataURL(file[i]);

         }*/
        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);
        return deferred.promise;

      }

    }
  }]);
